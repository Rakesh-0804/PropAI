import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ enquiries: [] });

    const where = user.role === 'buyer' ? { buyerId: user.id } : { sellerId: user.id };

    const enquiries = await prisma.enquiry.findMany({
      where,
      include: {
        property: true,
        buyer: { select: { name: true, email: true, phone: true } },
        seller: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ enquiries });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to send enquiry' }, { status: 401 });
    }

    const { propertyId, message } = await request.json();
    if (!propertyId || !message) {
      return NextResponse.json({ error: 'Property ID and message are required' }, { status: 400 });
    }

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        propertyId,
        buyerId: user.id,
        sellerId: property.ownerId,
        message,
        status: 'pending',
      },
    });

    // Notify seller
    await prisma.notification.create({
      data: {
        userId: property.ownerId,
        type: 'enquiry',
        message: `New enquiry received for "${property.title}" from ${user.name}`,
      },
    });

    return NextResponse.json({ enquiry, message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Enquiry API Error:', error);
    return NextResponse.json({ error: 'Failed to send enquiry' }, { status: 500 });
  }
}
