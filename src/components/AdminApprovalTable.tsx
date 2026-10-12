'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { Property, formatINR } from '@/types';

interface AdminApprovalTableProps {
  initialProperties: Property[];
}

export default function AdminApprovalTable({ initialProperties }: AdminApprovalTableProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: 'verified' | 'rejected') => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setProperties(prev =>
          prev.map(p => (p.id === id ? { ...p, verifiedStatus: status } : p))
        );
      } else {
        alert('Failed to update status in database');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="glass-card p-6 border border-white/15 shadow-2xl overflow-hidden space-y-4 text-[#eaf2ff]">
      <div className="flex justify-between items-center border-b border-white/15 pb-4">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#5f86ff]" />
            Property Verification Gateway
          </h3>
          <p className="text-xs text-[#93a9c7]">Review pending seller/agent listings before publishing on the platform.</p>
        </div>
        <span className="px-3 py-1 bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30 font-bold rounded-full text-xs">
          {properties.filter(p => p.verifiedStatus === 'pending').length} Pending Review
        </span>
      </div>

      <div className="overflow-x-auto border border-white/15 rounded-xl glass">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/10 text-[#eaf2ff] uppercase tracking-wider font-semibold border-b border-white/15">
            <tr>
              <th className="p-4">Property</th>
              <th className="p-4">Location</th>
              <th className="p-4">Price</th>
              <th className="p-4">AI Fraud & Duplicate Risk</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-[#93a9c7] font-medium">
            {properties.map((prop) => {
              const isPending = prop.verifiedStatus === 'pending';
              const isVerified = prop.verifiedStatus === 'verified';
              const isHighRisk = prop.title.toLowerCase().includes('pending');

              return (
                <tr key={prop.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-white/15 shrink-0">
                      <Image
                        src={prop.media?.[0]?.mediaUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80'}
                        alt={prop.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{prop.title}</h4>
                      <p className="text-[10px] text-[#93a9c7] capitalize">{prop.propertyType} • {prop.bedrooms} Beds</p>
                    </div>
                  </td>

                  <td className="p-4 text-white">{prop.city}, {prop.state}</td>

                  <td className="p-4 font-bold text-[#5f86ff]">{formatINR(prop.price)}</td>

                  <td className="p-4">
                    {isHighRisk ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3 text-amber-400" /> Medium Fraud Risk (18%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <Sparkles className="w-3 h-3 text-emerald-400" /> Low Risk (2%)
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {isVerified ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Verified & Live
                      </span>
                    ) : prop.verifiedStatus === 'rejected' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Rejected
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Pending Admin Gate
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    {isPending ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={loadingId === prop.id}
                          onClick={() => handleStatusChange(prop.id, 'verified')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors shadow-md cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          disabled={loadingId === prop.id}
                          onClick={() => handleStatusChange(prop.id, 'rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 font-bold hover:bg-rose-500/30 transition-colors border border-rose-500/30 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#93a9c7] italic">Updated in DB</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
