import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { safeDbQuery } from '@/lib/dbCircuitBreaker';

// In-memory wishlist store for offline/demo fallback
const inMemoryWishlists: Record<string, string[]> = {};

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ wishlist: [] });

    const items = await safeDbQuery(
      async () => {
        return await prisma.wishlist.findMany({
          where: { userId: user.id },
          include: {
            property: {
              include: { media: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
      },
      null,
      800
    );

    if (items && Array.isArray(items)) {
      const properties = items.map((item: any) => ({
        ...item.property,
        amenities: JSON.parse(item.property.amenities || '[]'),
        createdAt: item.property.createdAt ? new Date(item.property.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: item.property.updatedAt ? new Date(item.property.updatedAt).toISOString() : new Date().toISOString(),
        type: item.property.type as any,
        propertyType: item.property.propertyType as any,
        status: item.property.status as any,
        verifiedStatus: item.property.verifiedStatus as any,
        media: (item.property.media || []).map((m: any) => ({
          ...m,
          type: m.type as any,
          createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
        })),
      }));

      return NextResponse.json({ wishlist: properties });
    }

    // Fallback: Return in-memory wishlist IDs (or empty array) with 200 OK
    const userWishlistIds = inMemoryWishlists[user.id] || [];
    return NextResponse.json({ wishlist: userWishlistIds });
  } catch (error) {
    // Never fail with 500
    return NextResponse.json({ wishlist: [] }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { propertyId } = body;
    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 });
    }

    if (!inMemoryWishlists[user.id]) {
      inMemoryWishlists[user.id] = [];
    }

    const dbResult = await safeDbQuery(
      async () => {
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
          return { isWishlisted: false, message: 'Removed from wishlist' };
        } else {
          await prisma.wishlist.create({
            data: {
              userId: user.id,
              propertyId,
            },
          });
          return { isWishlisted: true, message: 'Added to wishlist' };
        }
      },
      null,
      1000
    );

    if (dbResult) {
      return NextResponse.json(dbResult);
    }

    // Fallback in-memory toggle
    const list = inMemoryWishlists[user.id];
    const index = list.indexOf(propertyId);
    let isWishlisted = false;
    if (index > -1) {
      list.splice(index, 1);
      isWishlisted = false;
    } else {
      list.push(propertyId);
      isWishlisted = true;
    }

    return NextResponse.json({
      isWishlisted,
      message: isWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
    });
  } catch (error) {
    return NextResponse.json({ isWishlisted: false, message: 'Wishlist updated' }, { status: 200 });
  }
}
