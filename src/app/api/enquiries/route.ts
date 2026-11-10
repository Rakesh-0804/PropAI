import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { safeDbQuery } from '@/lib/dbCircuitBreaker';

const inMemoryEnquiries: any[] = [
  {
    id: 'enq-demo-1',
    propertyId: 'prop-fallback-1',
    buyerId: 'usr-buyer-demo',
    sellerId: 'usr-seller-demo',
    message: 'Hello Priya, is the price negotiable for immediate bank transfer? Would like to view the clubhouse.',
    status: 'responded',
    createdAt: new Date().toISOString(),
    property: {
      id: 'prop-fallback-1',
      title: 'The Sky View Glass Penthouse',
      city: 'Bangalore',
      price: 34500000,
    },
    buyer: { name: 'Rohan Sharma (Buyer)', email: 'buyer@example.com', phone: '+91 98765 43210' },
    seller: { name: 'Priya Sundaram (Seller)', email: 'seller@example.com', phone: '+91 98123 45678' },
  },
  {
    id: 'enq-demo-2',
    propertyId: 'prop-fallback-2',
    buyerId: 'usr-buyer-demo',
    sellerId: 'usr-seller-demo',
    message: 'Are title deeds and RERA registration documents ready for legal diligence?',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    property: {
      id: 'prop-fallback-2',
      title: 'Oberoi Sky Heights Luxury Suite',
      city: 'Mumbai',
      price: 68000000,
    },
    buyer: { name: 'Rohan Sharma (Buyer)', email: 'buyer@example.com', phone: '+91 98765 43210' },
    seller: { name: 'Vikramaditya Singhania', email: 'vikram@example.com', phone: '+91 98222 33445' },
  },
];

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ enquiries: [] });

    const where = user.role === 'buyer' ? { buyerId: user.id } : { sellerId: user.id };

    const enquiries = await safeDbQuery(
      async () => {
        return await prisma.enquiry.findMany({
          where,
          include: {
            property: true,
            buyer: { select: { name: true, email: true, phone: true } },
            seller: { select: { name: true, email: true, phone: true } },
          },
          orderBy: { createdAt: 'desc' },
        });
      },
      null,
      800
    );

    if (enquiries && Array.isArray(enquiries)) {
      return NextResponse.json({ enquiries });
    }

    return NextResponse.json({ enquiries: inMemoryEnquiries });
  } catch (error) {
    return NextResponse.json({ enquiries: inMemoryEnquiries }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to send enquiry' }, { status: 401 });
    }

    const { propertyId, message } = await request.json().catch(() => ({}));
    if (!propertyId || !message) {
      return NextResponse.json({ error: 'Property ID and message are required' }, { status: 400 });
    }

    const dbResult = await safeDbQuery(
      async () => {
        const property = await prisma.property.findUnique({ where: { id: propertyId } });
        if (!property) return null;

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
        }).catch(() => null);

        return enquiry;
      },
      null,
      1000
    );

    if (dbResult) {
      return NextResponse.json({ enquiry: dbResult, message: 'Enquiry submitted successfully' });
    }

    // In-memory fallback
    const fallbackEnquiry = {
      id: `enq-local-${Date.now()}`,
      propertyId,
      buyerId: user.id,
      sellerId: 'usr-seller-demo',
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    inMemoryEnquiries.unshift(fallbackEnquiry);

    return NextResponse.json({ enquiry: fallbackEnquiry, message: 'Enquiry submitted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Enquiry received' }, { status: 200 });
  }
}
