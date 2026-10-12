import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const alerts = await prisma.savedSearchAlert.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch search alerts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const buyer = await prisma.user.findFirst({ where: { role: 'buyer' } });
    if (!buyer) return NextResponse.json({ error: 'Buyer account required' }, { status: 400 });

    const alert = await prisma.savedSearchAlert.create({
      data: {
        userId: buyer.id,
        title: body.title || 'Custom Saved Alert',
        filterCriteria: JSON.stringify(body.filterCriteria || {}),
      },
    });

    // Create Notification Trigger
    await prisma.notification.create({
      data: {
        userId: buyer.id,
        type: 'alert',
        message: `Saved Alert "${alert.title}" is active. You will receive notifications when new matching properties are listed.`,
      },
    });

    return NextResponse.json({ alert, message: 'Saved search alert created!' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
  }
}
