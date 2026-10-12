import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin role required' }, { status: 403 });
    }

    const { status } = await request.json(); // verified, rejected
    if (!['verified', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await prisma.property.update({
      where: { id: params.id },
      data: { verifiedStatus: status },
    });

    return NextResponse.json({ property: updated, message: `Listing marked as ${status}` });
  } catch (error) {
    console.error('Admin Property API Error:', error);
    return NextResponse.json({ error: 'Failed to update verification status' }, { status: 500 });
  }
}
