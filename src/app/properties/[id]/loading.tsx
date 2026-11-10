import React from 'react';
import { Sparkles, Building2, Eye, Compass, Calculator } from 'lucide-react';

export default function PropertyDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse text-[#eaf2ff]">
      {/* Top Breadcrumb & Actions Bar Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-2">
          <div className="h-4 w-48 bg-white/10 rounded-lg" />
          <div className="h-8 w-80 sm:w-96 bg-white/15 rounded-xl" />
          <div className="h-4 w-64 bg-white/10 rounded-lg" />
        </div>
        <div className="h-10 w-44 bg-[#5f86ff]/20 rounded-2xl border border-[#5f86ff]/30" />
      </div>

      {/* Hero Showcase Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Main Media) */}
        <div className="lg:col-span-8 space-y-4">
          {/* View Mode Ribbon */}
          <div className="h-12 w-full bg-white/5 rounded-2xl border border-white/10" />

          {/* Main Photo Showcase */}
          <div className="aspect-16/9 w-full bg-slate-900/80 rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center">
            <Building2 className="w-16 h-16 text-white/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-16 bg-white/10 rounded-xl" />
            ))}
          </div>

          {/* Key Specs Card */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="h-6 w-48 bg-white/15 rounded-lg" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-white/5 rounded-2xl border border-white/5" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar CTA & Valuation) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="h-10 w-full bg-[#5f86ff]/20 rounded-xl" />
            <div className="h-12 w-full bg-white/10 rounded-xl" />
            <div className="h-12 w-full bg-white/10 rounded-xl" />
            <div className="h-12 w-full bg-white/10 rounded-xl" />
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="h-5 w-40 bg-white/15 rounded" />
            <div className="h-20 w-full bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
