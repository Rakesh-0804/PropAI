import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { generateSmartLockAccess } from '@/lib/iot/smartLockGateway';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ visits: [] });

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let whereClause: any = { buyerId: user.id };
    if (role === 'seller' || user.role === 'seller' || user.role === 'agent') {
      whereClause = { property: { ownerId: user.id } };
    }

    const visits = await prisma.siteVisit.findMany({
      where: whereClause,
      include: {
        property: true,
        buyer: { select: { id: true, name: true, email: true, phone: true } },
        accessLogs: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ visits });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch site visits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to schedule visit' }, { status: 401 });
    }

    const { propertyId, requestedDate, requestedTime, notes } = await request.json();
    if (!propertyId || !requestedDate || !requestedTime) {
      return NextResponse.json({ error: 'Property ID, date, and time are required' }, { status: 400 });
    }

    let visit = await prisma.siteVisit.create({
      data: {
        propertyId,
        buyerId: user.id,
        requestedDate,
        requestedTime,
        notes: notes || null,
        status: 'confirmed', // Auto-confirm for instant self-guided tour access
      },
      include: { property: true, buyer: true },
    });

    // Auto-generate Smart Lock PIN code for confirmed visit
    visit = await generateSmartLockAccess({ siteVisitId: visit.id });

    return NextResponse.json({ visit, message: 'Site visit confirmed! Smart lock PIN code generated.' });
  } catch (error) {
    console.error('Visits API Error:', error);
    return NextResponse.json({ error: 'Failed to schedule site visit' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { visitId, status } = await request.json();
    if (!visitId || !status) {
      return NextResponse.json({ error: 'visitId and status are required' }, { status: 400 });
    }

    let visit = await prisma.siteVisit.update({
      where: { id: visitId },
      data: { status },
      include: { property: true, buyer: true },
    });

    if (status === 'confirmed' && !visit.pinCode) {
      visit = await generateSmartLockAccess({ siteVisitId: visit.id });
    }

    return NextResponse.json({ visit, message: `Site visit status updated to ${status}` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update visit status' }, { status: 500 });
  }
}
