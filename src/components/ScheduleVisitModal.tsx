'use client';

import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface ScheduleVisitModalProps {
  propertyId: string;
  propertyTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleVisitModal({ propertyId, propertyTitle, isOpen, onClose }: ScheduleVisitModalProps) {
  const { user } = useAuth();
  const [date, setDate] = useState('2026-09-12');
  const [time, setTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please log in to schedule a site visit.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          requestedDate: date,
          requestedTime: time,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error || 'Failed to schedule visit.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030a14]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card bg-[#0b1728]/95 border border-white/20 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-[#eaf2ff]">
        <div className="flex justify-between items-center border-b border-white/15 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#5f86ff]" />
            <h3 className="font-bold text-white text-base">Schedule Site Visit</h3>
          </div>
          <button onClick={onClose} className="text-[#93a9c7] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <div>
              {error} {!user && <Link href="/login" className="font-bold underline ml-1 text-[#5f86ff]">Sign In</Link>}
            </div>
          </div>
        )}

        {isSuccess ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-white text-lg">Self-Guided Tour Confirmed!</h4>
            <p className="text-xs text-[#93a9c7]">
              Your visit for <span className="font-semibold text-white">{date} at {time}</span> has been confirmed.
            </p>
            <div className="glass-panel p-4 rounded-xl border border-white/15 space-y-1">
              <span className="text-[10px] text-[#93a9c7] font-bold uppercase tracking-wider block">Single-Use Smart Lock PIN Code</span>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {Math.floor(100000 + Math.random() * 900000)}
              </div>
              <span className="text-[10px] text-[#93a9c7] block">Valid on {date} during your 1-hour tour window</span>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2.5 btn-primary text-white rounded-xl text-xs font-bold shadow-md transition-colors w-full cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-[#93a9c7]">
            <p className="text-[#93a9c7] font-normal line-clamp-1">Property: {propertyTitle}</p>

            <div>
              <label className="block mb-1 text-[#eaf2ff]">Select Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 glass-input text-white font-medium"
              />
            </div>

            <div>
              <label className="block mb-1 text-[#eaf2ff]">Preferred Time Slot</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/80 border border-white/20 text-white rounded-xl focus:outline-none focus:border-[#5f86ff] font-medium"
              >
                <option value="09:00" className="bg-slate-900 text-white">09:00 AM</option>
                <option value="11:00" className="bg-slate-900 text-white">11:00 AM</option>
                <option value="14:00" className="bg-slate-900 text-white">02:00 PM</option>
                <option value="16:00" className="bg-slate-900 text-white">04:00 PM</option>
                <option value="18:00" className="bg-slate-900 text-white">06:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-[#eaf2ff]">Additional Notes</label>
              <textarea
                rows={3}
                placeholder="e.g. Self-guided tour request..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 glass-input text-white font-medium"
              />
            </div>

            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30 text-[11px] text-emerald-300 font-normal flex items-start gap-2">
              <span className="font-bold text-emerald-400 shrink-0">🔑 IoT Smart Access:</span>
              <span>Instant single-use PIN key will be generated for self-guided tour access.</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 btn-primary text-white rounded-xl font-bold shadow-md transition-colors text-sm cursor-pointer"
            >
              {submitting ? 'Booking & Generating Key...' : 'Confirm Self-Guided Tour & Generate PIN'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
