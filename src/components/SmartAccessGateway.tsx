'use client';

import React, { useState, useEffect } from 'react';
import { SiteVisit, SmartLockAccessLog } from '@/types';
import {
  Lock,
  Unlock,
  Key,
  ShieldAlert,
  ShieldCheck,
  Clock,
  UserCheck,
  Activity,
  RefreshCw,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';

interface SmartAccessGatewayProps {
  siteVisitId?: string;
  propertyId?: string;
  isOwnerView?: boolean;
}

export default function SmartAccessGateway({
  siteVisitId,
  propertyId,
  isOwnerView = false,
}: SmartAccessGatewayProps) {
  const [visit, setVisit] = useState<SiteVisit | null>(null);
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [logs, setLogs] = useState<SmartLockAccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchLockStatus();
  }, [siteVisitId, propertyId]);

  const fetchLockStatus = async () => {
    setLoading(true);
    try {
      if (siteVisitId) {
        const res = await fetch(`/api/iot/locks?siteVisitId=${siteVisitId}`);
        const json = await res.json();
        if (res.ok) {
          setVisit(json.visit);
          setLogs(json.logs || []);
        }
      } else if (propertyId) {
        const res = await fetch(`/api/iot/locks?propertyId=${propertyId}`);
        const json = await res.json();
        if (res.ok) {
          setVisits(json.visits || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch IoT lock status', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLockEvent = async (
    targetVisitId: string,
    eventType: 'check_in' | 'check_out' | 'door_unlocked' | 'door_locked' | 'simulate_expiry_alert'
  ) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/iot/locks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'event',
          siteVisitId: targetVisitId,
          eventType,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        fetchLockStatus();
      }
    } catch (err) {
      console.error('Lock event error', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleGeneratePin = async (targetVisitId: string) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/iot/locks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          siteVisitId: targetVisitId,
          provider: 'Seam',
        }),
      });
      if (res.ok) {
        fetchLockStatus();
      }
    } catch (err) {
      console.error('Generate PIN error', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card text-white rounded-2xl p-8 text-center space-y-3 border border-white/15">
        <Radio className="w-6 h-6 text-emerald-400 animate-pulse mx-auto" />
        <p className="text-sm font-semibold">Connecting to Smart Lock Gateway API...</p>
      </div>
    );
  }

  // Owner Console View
  if (isOwnerView) {
    return (
      <div className="glass-card text-white rounded-2xl p-6 shadow-2xl border border-white/15 space-y-6">
        {/* Gateway Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Radio className="w-3.5 h-3.5" /> IoT Access Gateway Active
              </span>
              <span className="text-xs text-[#93a9c7] font-mono">Integration: Seam / Yale / August API</span>
            </div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" /> Smart Access Management Console
            </h3>
          </div>

          <button
            onClick={fetchLockStatus}
            className="px-3 py-2 rounded-xl text-xs font-bold glass hover:bg-white/10 text-[#eaf2ff] border border-white/15 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Hardware Status
          </button>
        </div>

        {/* Security Alerts Banner */}
        {visits.some((v) => v.lockAlertTriggered) && (
          <div className="bg-rose-500/20 border-2 border-rose-500/50 p-4 rounded-xl flex items-start gap-3 animate-pulse">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-rose-300 text-sm">SECURITY ALERT TRIGGERED</h4>
              <p className="text-xs text-rose-200">
                One or more self-guided property tour windows have expired while the front door lock remains UNLOCKED.
              </p>
            </div>
          </div>
        )}

        {/* Smart Access Visit Cards Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#93a9c7] uppercase tracking-wider">Scheduled Visits & Smart Lock Devices</h4>
          
          {visits.length === 0 ? (
            <div className="p-8 text-center text-[#93a9c7] text-xs glass-panel rounded-xl border border-white/10">
              No site visits scheduled for this property yet.
            </div>
          ) : (
            <div className="space-y-3">
              {visits.map((v) => (
                <div
                  key={v.id}
                  className={`p-4 rounded-xl border transition-all ${
                    v.lockAlertTriggered
                      ? 'bg-rose-950/40 border-rose-500/50'
                      : 'glass-panel border-white/15'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{v.buyer?.name || 'Self-Guided Visitor'}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                            v.doorStatus === 'unlocked'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {v.doorStatus === 'unlocked' ? '🔓 Unlocked' : '🔒 Locked'}
                        </span>
                        {v.lockProvider && (
                          <span className="text-[10px] font-mono text-[#93a9c7] glass px-2 py-0.5 rounded border border-white/15">
                            {v.lockProvider} Smart Lock
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#93a9c7] flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#5f86ff]" /> {v.requestedDate} @ {v.requestedTime}
                        </span>
                        {v.pinCode && (
                          <span className="font-mono text-emerald-400 font-bold glass px-2 py-0.5 rounded border border-emerald-500/30">
                            PIN: {v.pinCode}
                          </span>
                        )}
                      </div>

                      {v.checkInAt && (
                        <div className="text-[11px] text-emerald-400 font-medium">
                          Check-in: {new Date(v.checkInAt).toLocaleTimeString()} {v.checkOutAt ? `• Check-out: ${new Date(v.checkOutAt).toLocaleTimeString()}` : ''}
                        </div>
                      )}

                      {v.lockAlertNotes && (
                        <div className="text-[11px] font-semibold text-rose-400 mt-1">
                          ⚠️ {v.lockAlertNotes}
                        </div>
                      )}
                    </div>

                    {/* Action Controls for Owner */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!v.pinCode ? (
                        <button
                          onClick={() => handleGeneratePin(v.id)}
                          disabled={processing}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md cursor-pointer"
                        >
                          Generate Single-Use PIN
                        </button>
                      ) : (
                        <>
                          {v.doorStatus === 'unlocked' ? (
                            <button
                              onClick={() => handleLockEvent(v.id, 'door_locked')}
                              disabled={processing}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold glass hover:bg-white/15 text-white border border-white/20 flex items-center gap-1 cursor-pointer"
                            >
                              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Lock Door
                            </button>
                          ) : (
                            <button
                              onClick={() => handleLockEvent(v.id, 'door_unlocked')}
                              disabled={processing}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold glass hover:bg-white/15 text-white border border-white/20 flex items-center gap-1 cursor-pointer"
                            >
                              <Unlock className="w-3.5 h-3.5 text-amber-400" /> Unlock Door
                            </button>
                          )}

                          <button
                            onClick={() => handleLockEvent(v.id, 'simulate_expiry_alert')}
                            disabled={processing}
                            className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer"
                            title="Simulate Expiry Security Alert"
                          >
                            Simulate Alert
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Buyer Digital PIN Key Card View
  if (!visit) {
    return null;
  }

  return (
    <div className="glass-card text-white rounded-2xl p-5 border border-white/15 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/15 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white">Smart Access Digital Key</h4>
            <span className="text-[10px] text-[#93a9c7] font-mono">Provider: {visit.lockProvider || 'Seam'} Gateway</span>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            visit.doorStatus === 'unlocked'
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
          }`}
        >
          {visit.doorStatus === 'unlocked' ? '🔓 Unlocked' : '🔒 Securely Locked'}
        </span>
      </div>

      {visit.pinCode ? (
        <div className="glass-panel p-4 rounded-xl border border-white/15 text-center space-y-2">
          <span className="text-[11px] text-[#93a9c7] uppercase font-bold tracking-widest block">Single-Use Access PIN Code</span>
          <div className="text-3xl font-black font-mono tracking-widest text-emerald-400 bg-slate-900/80 py-2 px-4 rounded-xl border border-emerald-500/30 inline-block shadow-inner">
            {visit.pinCode}
          </div>
          <p className="text-[11px] text-[#93a9c7]">
            Valid on {visit.requestedDate} starting at {visit.requestedTime} (1 Hour Access Window)
          </p>

          {/* Interactive Check-in / Check-out Simulation Buttons for Buyer */}
          <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/10">
            {!visit.checkInAt ? (
              <button
                onClick={() => handleLockEvent(visit.id, 'check_in')}
                disabled={processing}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" /> Check-In Now
              </button>
            ) : !visit.checkOutAt ? (
              <button
                onClick={() => handleLockEvent(visit.id, 'check_out')}
                disabled={processing}
                className="px-4 py-2 rounded-xl text-xs font-bold btn-primary text-white shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-4 h-4" /> Check-Out & Lock Door
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Tour Completed & Door Locked
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-4 rounded-xl border border-white/15 text-center space-y-3">
          <p className="text-xs text-[#93a9c7]">Smart Access PIN key will be issued upon tour confirmation.</p>
          <button
            onClick={() => handleGeneratePin(visit.id)}
            disabled={processing}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
          >
            Generate Key Now
          </button>
        </div>
      )}
    </div>
  );
}
