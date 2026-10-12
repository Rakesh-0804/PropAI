'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle2, X } from 'lucide-react';
import { PropertyFilterParams } from '@/types';

interface SavedAlertsModalProps {
  currentFilters: PropertyFilterParams;
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedAlertsModal({ currentFilters, isOpen, onClose }: SavedAlertsModalProps) {
  const [title, setTitle] = useState(
    `${currentFilters.city || 'All Cities'} ${currentFilters.propertyType || 'Properties'} Alert`
  );
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          filterCriteria: currentFilters,
        }),
      });
      setIsSaved(true);
    } catch (err) {
      console.error('Failed to save alert:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030a14]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card bg-[#0b1728]/95 border border-white/20 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-[#eaf2ff]">
        <div className="flex justify-between items-center border-b border-white/15 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Create Smart Search Alert</h3>
          </div>
          <button onClick={onClose} className="text-[#93a9c7] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSaved ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-white text-lg">Search Alert Created!</h4>
            <p className="text-xs text-[#93a9c7]">
              You will automatically receive alerts whenever a property matching your filters is published.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2.5 btn-primary text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-[#93a9c7]">
            <div>
              <label className="block mb-1 text-[#eaf2ff]">Alert Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 glass-input text-white font-medium"
              />
            </div>

            <div className="p-3 glass-panel rounded-xl space-y-1 text-[#eaf2ff] border border-white/10">
              <span className="text-[10px] uppercase font-bold text-[#93a9c7] block">Saved Criteria Summary</span>
              <p>City: {currentFilters.city || 'Any'}</p>
              <p>Type: {currentFilters.propertyType || 'All Types'}</p>
              <p>Max Price: {currentFilters.maxPrice ? `₹${currentFilters.maxPrice.toLocaleString()}` : 'No Limit'}</p>
              <p>Min Beds: {currentFilters.bedrooms || 'Any'}</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-md transition-colors text-sm cursor-pointer"
            >
              Save Alert & Enable Notifications
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
