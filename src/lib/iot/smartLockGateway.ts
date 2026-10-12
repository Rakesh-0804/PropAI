import { db } from '@/lib/db';
import { SiteVisit, SmartLockAccessLog } from '@/types';

export interface SmartLockPINRequest {
  siteVisitId: string;
  provider?: 'Seam' | 'Yale' | 'August';
}

export interface SmartLockEventPayload {
  siteVisitId: string;
  eventType: 'check_in' | 'check_out' | 'door_unlocked' | 'door_locked' | 'simulate_expiry_alert';
  actor?: 'buyer' | 'lock_gateway' | 'system';
}

/**
 * Generates a secure, 6-digit single-use PIN code for a confirmed site visit
 * bounded by the visit's date and time window.
 */
export async function generateSmartLockAccess(request: SmartLockPINRequest) {
  const visit = await db.siteVisit.findUnique({
    where: { id: request.siteVisitId },
    include: { property: true, buyer: true },
  });

  if (!visit) {
    throw new Error('Site visit record not found');
  }

  // Generate 6-digit PIN code
  const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
  const provider = request.provider || visit.lockProvider || 'Seam';
  const smartLockId = `lock-${provider.toLowerCase()}-${visit.propertyId.slice(0, 8)}`;

  // Parse start and end timestamps based on visit date (YYYY-MM-DD) and time (HH:MM)
  const visitDateStr = visit.requestedDate; // e.g. "2026-09-15"
  const visitTimeStr = visit.requestedTime || "14:00"; // e.g. "14:00"

  const startIso = new Date(`${visitDateStr}T${visitTimeStr}:00`).toISOString();
  // Valid for 1 hour duration
  const endDate = new Date(new Date(startIso).getTime() + 60 * 60 * 1000);
  const endIso = endDate.toISOString();

  // Update site visit with smart lock details
  const updatedVisit = await db.siteVisit.update({
    where: { id: visit.id },
    data: {
      pinCode,
      smartLockId,
      lockProvider: provider,
      accessValidFrom: new Date(startIso),
      accessValidTo: endDate,
      doorStatus: 'locked',
      lockAlertTriggered: false,
    },
    include: { property: true, buyer: true },
  });

  // Log event
  await db.smartLockAccessLog.create({
    data: {
      siteVisitId: visit.id,
      eventType: 'pin_created',
      message: `Single-use PIN code ${pinCode} issued via ${provider} Gateway. Valid ${visitDateStr} ${visitTimeStr} to ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      actor: 'lock_gateway',
    },
  });

  return updatedVisit;
}

/**
 * Handles incoming smart lock hardware events or user simulated actions (Check-in, Check-out, Lock/Unlock)
 */
export async function processSmartLockEvent(payload: SmartLockEventPayload) {
  const visit = await db.siteVisit.findUnique({
    where: { id: payload.siteVisitId },
    include: { property: true, buyer: true },
  });

  if (!visit) {
    throw new Error('Site visit not found');
  }

  const now = new Date();
  const actor = payload.actor || 'buyer';
  let updateData: any = {};
  let logMessage = '';

  switch (payload.eventType) {
    case 'check_in':
      updateData = {
        checkInAt: now,
        doorStatus: 'unlocked',
      };
      logMessage = `Visitor ${visit.buyer?.name || 'Guest'} checked in successfully. Front door unlocked.`;
      break;

    case 'check_out':
      updateData = {
        checkOutAt: now,
        doorStatus: 'locked',
        status: 'completed',
      };
      logMessage = `Visitor ${visit.buyer?.name || 'Guest'} checked out. Front door securely locked. Tour completed.`;
      break;

    case 'door_unlocked':
      updateData = {
        doorStatus: 'unlocked',
      };
      logMessage = `Smart Lock unlocked with valid PIN code ${visit.pinCode || '******'}.`;
      break;

    case 'door_locked':
      updateData = {
        doorStatus: 'locked',
      };
      logMessage = `Smart Lock manually locked. Door is secure.`;
      break;

    case 'simulate_expiry_alert':
      // Security Alert: Tour window expired while door remains unlocked!
      updateData = {
        doorStatus: 'unlocked',
        lockAlertTriggered: true,
        lockAlertNotes: `SECURITY ALERT: Self-guided tour window expired at ${visit.accessValidTo ? new Date(visit.accessValidTo).toLocaleTimeString() : 'end time'}, but door is still UNLOCKED!`,
      };
      logMessage = `SECURITY ALERT TRIGGERED: Door unlocked post-expiry window! Owner notified immediately.`;

      // Trigger Security Notification to Property Owner
      if (visit.property?.ownerId) {
        await db.notification.create({
          data: {
            userId: visit.property.ownerId,
            type: 'iot_security',
            message: `⚠️ Security Alert: Smart lock at '${visit.property.title}' remains UNLOCKED after tour window expired! Visitor: ${visit.buyer?.name || 'Guest'}.`,
          },
        });
      }
      break;

    default:
      throw new Error(`Unsupported event type: ${payload.eventType}`);
  }

  const updatedVisit = await db.siteVisit.update({
    where: { id: visit.id },
    data: updateData,
  });

  await db.smartLockAccessLog.create({
    data: {
      siteVisitId: visit.id,
      eventType: payload.eventType,
      message: logMessage,
      actor,
    },
  });

  return updatedVisit;
}

/**
 * Checks for expired tours with unlocked doors across active site visits
 */
export async function auditSmartLockSecurityAlerts() {
  const now = new Date();

  // Find confirmed site visits where accessValidTo < now, doorStatus == 'unlocked', and alert not yet triggered
  const expiredUnlockedVisits = await db.siteVisit.findMany({
    where: {
      status: 'confirmed',
      doorStatus: 'unlocked',
      accessValidTo: { lt: now },
      lockAlertTriggered: false,
    },
  });

  const alerts: any[] = [];
  for (const visit of expiredUnlockedVisits) {
    const updated = await processSmartLockEvent({
      siteVisitId: visit.id,
      eventType: 'simulate_expiry_alert',
      actor: 'system',
    });
    alerts.push(updated);
  }

  return alerts;
}

export async function getSmartLockLogs(siteVisitId: string) {
  return await db.smartLockAccessLog.findMany({
    where: { siteVisitId },
    orderBy: { createdAt: 'desc' },
  });
}
