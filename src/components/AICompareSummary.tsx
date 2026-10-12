'use client';

import React from 'react';
import { Trophy, Award } from 'lucide-react';
import { Property } from '@/types';
import { computeComparisonWinners } from '@/lib/ai/compareEngine';

interface AICompareSummaryProps {
  properties: Property[];
}

export default function AICompareSummary({ properties }: AICompareSummaryProps) {
  if (!properties || properties.length === 0) return null;

  const winners = computeComparisonWinners(properties);
  if (!winners) return null;

  const { overallWinner, bestPricePerSqft, highestRoi, topLivability, largestSpace } = winners;

  return (
    <div className="glass-card p-6 shadow-2xl border border-white/15 space-y-6 font-sans text-[#eaf2ff]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg border border-amber-400/30 shrink-0">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              AI Executive Comparison Verdict & Winner Analysis
            </h3>
            <p className="text-xs text-[#93a9c7] mt-0.5">
              Comparative analysis evaluating rental yields, 10-Yr capital appreciation, price/sqft value & livability.
            </p>
          </div>
        </div>

        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-mono font-extrabold self-start sm:self-center">
          ✨ AGY Decision Engine Active
        </span>
      </div>

      {/* Overall Winner Banner */}
      <div className="glass-panel p-5 border border-amber-400/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
        <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 mt-1 md:mt-0">
            <Award className="w-6 h-6 text-amber-300" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold text-amber-300 tracking-wider bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                🏆 Top AI Choice Winner
              </span>
              <span className="text-xs text-[#93a9c7] font-mono font-bold">({overallWinner.city})</span>
            </div>
            <h4 className="font-black text-lg text-white">{overallWinner.title}</h4>
            <p className="text-xs text-[#93a9c7] max-w-2xl leading-relaxed">
              Offers the optimal balance of value at <b className="text-white">{overallWinner.formattedPricePerSqft}</b> in {overallWinner.city}, with a projected <b className="text-white">{overallWinner.estimated10YrReturn}% 10-Yr ROI</b> ({overallWinner.formatted10YrValue}) and high livability score ({overallWinner.walkScore}/100 walkability).
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 glass-panel px-4 py-3 border border-white/15 w-full md:w-auto flex md:block justify-between items-center">
          <span className="text-xs text-[#93a9c7] block font-semibold">AI Match Verdict</span>
          <span className="text-3xl font-black text-emerald-400">{overallWinner.aiOverallScore}/100</span>
        </div>
      </div>

      {/* Category Winners Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Best Value */}
        <div className="glass-panel p-4 space-y-2 hover:border-white/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[#93a9c7] font-bold text-[10px] uppercase tracking-wider">🏷️ Best Price / Sqft</span>
            <span className="text-[10px] bg-[#5f86ff]/20 text-[#5f86ff] px-2 py-0.5 rounded font-bold border border-[#5f86ff]/30">Value Leader</span>
          </div>
          <div className="font-extrabold text-sm text-white truncate">{bestPricePerSqft.title}</div>
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[#93a9c7]">Rate:</span>
            <span className="text-[#5f86ff] font-mono font-extrabold">{bestPricePerSqft.formattedPricePerSqft}</span>
          </div>
        </div>

        {/* Highest ROI */}
        <div className="glass-panel p-4 space-y-2 hover:border-white/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[#93a9c7] font-bold text-[10px] uppercase tracking-wider">📈 Highest 10-Yr ROI</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">Max Growth</span>
          </div>
          <div className="font-extrabold text-sm text-white truncate">{highestRoi.title}</div>
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[#93a9c7]">Projected Growth:</span>
            <span className="text-emerald-400 font-mono font-extrabold">+{highestRoi.estimated10YrReturn}%</span>
          </div>
        </div>

        {/* Top Livability */}
        <div className="glass-panel p-4 space-y-2 hover:border-white/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[#93a9c7] font-bold text-[10px] uppercase tracking-wider">🌟 Top Livability</span>
            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold border border-purple-500/30">Walk & Safety</span>
          </div>
          <div className="font-extrabold text-sm text-white truncate">{topLivability.title}</div>
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[#93a9c7]">Walk / Safety:</span>
            <span className="text-purple-400 font-mono font-extrabold">{topLivability.walkScore} / {topLivability.safetyScore}</span>
          </div>
        </div>

        {/* Maximum Space */}
        <div className="glass-panel p-4 space-y-2 hover:border-white/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[#93a9c7] font-bold text-[10px] uppercase tracking-wider">📐 Largest Floor Plan</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold border border-amber-500/30">Max Sqft</span>
          </div>
          <div className="font-extrabold text-sm text-white truncate">{largestSpace.title}</div>
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-[#93a9c7]">Total Area:</span>
            <span className="text-amber-400 font-mono font-extrabold">{largestSpace.sizeSqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
