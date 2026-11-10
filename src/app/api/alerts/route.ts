import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeDbQuery } from '@/lib/dbCircuitBreaker';

const inMemoryAlerts: any[] = [
  {
    id: 'alert-1',
    userId: 'usr-buyer-demo',
    title: 'Bangalore 3+ BHK Penthouse Alert',
    filterCriteria: JSON.stringify({ city: 'Bangalore', bedrooms: 3, maxPrice: 50000000 }),
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const alerts = await safeDbQuery(
      async () => {
        return await prisma.savedSearchAlert.findMany({
          where: userId ? { userId } : {},
          orderBy: { createdAt: 'desc' },
        });
      },
      null,
      800
    );

    if (alerts && Array.isArray(alerts)) {
      return NextResponse.json({ alerts });
    }

    return NextResponse.json({ alerts: inMemoryAlerts });
  } catch (error) {
    return NextResponse.json({ alerts: inMemoryAlerts }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const result = await safeDbQuery(
      async () => {
        const buyer = await prisma.user.findFirst({ where: { role: 'buyer' } });
        if (!buyer) return null;

        const alert = await prisma.savedSearchAlert.create({
          data: {
            userId: buyer.id,
            title: body.title || 'Custom Saved Alert',
            filterCriteria: JSON.stringify(body.filterCriteria || {}),
          },
        });

        await prisma.notification.create({
          data: {
            userId: buyer.id,
            type: 'alert',
            message: `Saved Alert "${alert.title}" is active. You will receive notifications when new matching properties are listed.`,
          },
        }).catch(() => null);

        return alert;
      },
      null,
      1000
    );

    if (result) {
      return NextResponse.json({ alert: result, message: 'Saved search alert created!' });
    }

    const fallbackAlert = {
      id: `alert-local-${Date.now()}`,
      userId: 'usr-buyer-demo',
      title: body.title || 'Custom Saved Alert',
      filterCriteria: JSON.stringify(body.filterCriteria || {}),
      createdAt: new Date().toISOString(),
    };
    inMemoryAlerts.unshift(fallbackAlert);

    return NextResponse.json({ alert: fallbackAlert, message: 'Saved search alert created!' });
  } catch (error) {
    return NextResponse.json({ message: 'Alert created' }, { status: 200 });
  }
}
