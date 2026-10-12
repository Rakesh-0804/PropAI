'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Trash2, ArrowRight, Sparkles, Filter } from 'lucide-react';

export default function SavedAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-[#eaf2ff]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-amber-400" /> Smart Property Match Alerts
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Saved Search Alerts ({alerts.length})
          </h1>
          <p className="text-xs text-[#93a9c7] mt-1">
            Manage your automated triggers for newly listed properties matching your filter criteria.
          </p>
        </div>

        <Link
          href="/properties"
          className="px-4 py-2.5 bg-[#5f86ff] hover:bg-[#4a72ee] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#5f86ff]/20 flex items-center gap-1.5 w-fit"
        >
          <Filter className="w-3.5 h-3.5" /> Save New Search Alert
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#93a9c7] font-semibold text-sm">
          Loading saved alerts...
        </div>
      ) : alerts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/15 shadow-2xl space-y-3">
          <Bell className="w-12 h-12 text-[#93a9c7] mx-auto opacity-60" />
          <h3 className="text-base font-bold text-white">No active search alerts</h3>
          <p className="text-xs text-[#93a9c7]">
            Set up search filters on the property search page and click "Save Alert" to get notified.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#5f86ff] hover:bg-[#4a72ee] text-white font-bold rounded-xl text-xs shadow-lg shadow-[#5f86ff]/20 transition-all"
          >
            Go to Property Search <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => {
            const criteria = JSON.parse(alert.filterCriteria || '{}');
            return (
              <div key={alert.id} className="glass-card rounded-2xl p-5 border border-white/15 shadow-2xl space-y-3 text-[#eaf2ff]">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-base">{alert.title}</h4>
                    <span className="text-[10px] text-[#93a9c7]">Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" /> Active Matching
                  </span>
                </div>

                <div className="p-3 glass-panel rounded-xl text-xs space-y-1 text-[#93a9c7] font-medium border border-white/10">
                  <p><span className="text-white font-semibold">Target City:</span> {criteria.city || 'Any City'}</p>
                  <p><span className="text-white font-semibold">Property Type:</span> {criteria.propertyType || 'All Types'}</p>
                  <p><span className="text-white font-semibold">Max Price:</span> {criteria.maxPrice ? `₹${criteria.maxPrice.toLocaleString()}` : 'Unlimited'}</p>
                  <p><span className="text-white font-semibold">Bedrooms:</span> {criteria.bedrooms ? `${criteria.bedrooms}+ Beds` : 'Any'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
