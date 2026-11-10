import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { safeDbQuery } from '@/lib/dbCircuitBreaker';

const inMemoryNotifications: any[] = [
  {
    id: 'notif-1',
    userId: 'usr-buyer-demo',
    type: 'visit_status',
    message: 'Your site visit for "The Sky View Glass Penthouse" has been confirmed. PIN: 894-201.',
    readStatus: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'usr-buyer-demo',
    type: 'alert',
    message: 'Price drop: Oberoi Sky Heights dropped by ₹15,00,000.',
    readStatus: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ notifications: [] });

    const notifications = await safeDbQuery(
      async () => {
        return await prisma.notification.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          take: 20,
        });
      },
      null,
      800
    );

    if (notifications && Array.isArray(notifications)) {
      return NextResponse.json({ notifications });
    }

    return NextResponse.json({ notifications: inMemoryNotifications });
  } catch (error) {
    return NextResponse.json({ notifications: inMemoryNotifications }, { status: 200 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json().catch(() => ({}));

    await safeDbQuery(
      async () => {
        if (id) {
          await prisma.notification.update({
            where: { id },
            data: { readStatus: true },
          });
        } else {
          await prisma.notification.updateMany({
            where: { userId: user.id, readStatus: false },
            data: { readStatus: true },
          });
        }
        return true;
      },
      null,
      800
    );

    return NextResponse.json({ message: 'Notifications updated' });
  } catch (error) {
    return NextResponse.json({ message: 'Notifications updated' }, { status: 200 });
  }
}
