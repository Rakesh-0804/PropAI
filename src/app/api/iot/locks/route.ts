import { NextRequest, NextResponse } from 'next/server';
import { generateSmartLockAccess, processSmartLockEvent, getSmartLockLogs, auditSmartLockSecurityAlerts } from '@/lib/iot/smartLockGateway';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const siteVisitId = searchParams.get('siteVisitId');
    const propertyId = searchParams.get('propertyId');

    if (siteVisitId) {
      const visit = await db.siteVisit.findUnique({
        where: { id: siteVisitId },
        include: { property: true, buyer: true, accessLogs: true },
      });
      const logs = await getSmartLockLogs(siteVisitId);
      return NextResponse.json({ visit, logs });
    }

    if (propertyId) {
      const visits = await db.siteVisit.findMany({
        where: { propertyId },
        include: { buyer: true, accessLogs: true },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ visits });
    }

    return NextResponse.json({ error: 'siteVisitId or propertyId required' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch IoT lock data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, siteVisitId, provider, eventType, actor } = body;

    if (action === 'generate') {
      if (!siteVisitId) {
        return NextResponse.json({ error: 'siteVisitId is required' }, { status: 400 });
      }
      const updatedVisit = await generateSmartLockAccess({ siteVisitId, provider });
      return NextResponse.json({ visit: updatedVisit, message: 'Smart Lock PIN key generated' });
    }

    if (action === 'event') {
      if (!siteVisitId || !eventType) {
        return NextResponse.json({ error: 'siteVisitId and eventType are required' }, { status: 400 });
      }
      const updatedVisit = await processSmartLockEvent({ siteVisitId, eventType, actor });
      return NextResponse.json({ visit: updatedVisit, message: `Smart Lock event '${eventType}' processed` });
    }

    if (action === 'audit') {
      const alerts = await auditSmartLockSecurityAlerts();
      return NextResponse.json({ alerts, message: `Security audit completed. ${alerts.length} security alerts triggered.` });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process IoT request' }, { status: 500 });
  }
}
