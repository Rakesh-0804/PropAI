import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ wishlist: [] });

    const items = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        property: {
          include: { media: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const properties = items.map(item => ({
      ...item.property,
      amenities: JSON.parse(item.property.amenities || '[]'),
      createdAt: item.property.createdAt.toISOString(),
      updatedAt: item.property.updatedAt.toISOString(),
      type: item.property.type as any,
      propertyType: item.property.propertyType as any,
      status: item.property.status as any,
      verifiedStatus: item.property.verifiedStatus as any,
      media: item.property.media.map(m => ({ ...m, type: m.type as any, createdAt: m.createdAt.toISOString() })),
    }));

    return NextResponse.json({ wishlist: properties });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { propertyId } = await request.json();
    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 });
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_propertyId: {
          userId: user.id,
          propertyId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ isWishlisted: false, message: 'Removed from wishlist' });
    } else {
      await prisma.wishlist.create({
        data: {
          userId: user.id,
          propertyId,
        },
      });
      return NextResponse.json({ isWishlisted: true, message: 'Added to wishlist' });
    }
  } catch (error) {
    console.error('Wishlist API Error:', error);
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}
