'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property, formatINR } from '@/types';
import { Check, X, ShieldCheck, Sparkles, ExternalLink, Trash2, Eye, Compass, Calculator, Layers, Key, Building2, MapPin } from 'lucide-react';
import { computeComprehensiveCompareMetrics } from '@/lib/ai/compareEngine';
import VirtualTourViewer from '@/components/VirtualTourViewer';

interface CompareMatrixProps {
  properties: Property[];
  onRemove: (propertyId: string) => void;
}

export default function CompareMatrix({ properties, onRemove }: CompareMatrixProps) {
  const [activeTourProperty, setActiveTourProperty] = useState<Property | null>(null);

  if (!properties || properties.length === 0) {
    return (
      <div className="glass-card p-12 text-center space-y-4 border border-white/15 shadow-2xl text-[#eaf2ff]">
        <div className="w-16 h-16 rounded-2xl bg-[#5f86ff]/20 text-[#5f86ff] flex items-center justify-center mx-auto border border-[#5f86ff]/30">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-white">No Properties Selected for Comparison</h3>
        <p className="text-xs text-[#93a9c7] max-w-sm mx-auto leading-relaxed">
          Select up to 4 properties from our catalog or choose a preset comparison bundle above to analyze prices, 10-Yr ROI, EMI, neighborhood livability scores, and amenities side-by-side.
        </p>
        <Link
          href="/properties"
          className="inline-block px-6 py-3 btn-primary text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
        >
          Explore Property Catalog
        </Link>
      </div>
    );
  }

  const comparedMetrics = properties.map(computeComprehensiveCompareMetrics);

  // Find minimum price per sqft for highlighting
  const minPricePerSqft = Math.min(...comparedMetrics.map(m => m.pricePerSqft));
  const maxSqft = Math.max(...comparedMetrics.map(m => m.sizeSqft));
  const maxRoi = Math.max(...comparedMetrics.map(m => m.estimated10YrReturn));

  // Collect all unique amenities across compared properties
  const allAmenities = Array.from(
    new Set(properties.flatMap(p => p.amenities || []))
  );

  return (
    <div className="space-y-6 text-[#eaf2ff]">
      <div className="glass-card border border-white/15 shadow-2xl overflow-x-auto rounded-3xl">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-white/15 bg-white/10">
              <th className="p-4 w-52 text-xs font-black text-[#93a9c7] uppercase tracking-wider sticky left-0 bg-[#030a14]/90 backdrop-blur z-10">
                Property Feature
              </th>
              {comparedMetrics.map((m, idx) => {
                const originalProp = properties.find(p => p.id === m.id) || properties[idx];
                return (
                  <th key={m.id} className="p-4 min-w-[240px] max-w-[300px] align-top">
                    <div className="relative space-y-3">
                      {/* Remove Button */}
                      <button
                        onClick={() => onRemove(m.id)}
                        className="absolute -top-1 -right-1 z-20 p-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-full border border-rose-500/30 transition-colors shadow-xs cursor-pointer"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Real Property Photo */}
                      <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 border border-white/15 group">
                        <Image
                          src={m.primaryImage}
                          alt={m.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />

                        {/* 360° Tour Launch Button Overlay */}
                        {m.hasTour360 && (
                          <button
                            onClick={() => setActiveTourProperty(originalProp)}
                            className="absolute bottom-2 left-2 right-2 py-1.5 bg-slate-900/90 hover:bg-[#5f86ff] text-white text-[10px] font-extrabold rounded-xl backdrop-blur transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" /> 🌐 Launch 360° Tour
                          </button>
                        )}
                      </div>

                      {/* Property Title & Location */}
                      <div>
                        <Link
                          href={`/properties/${m.id}`}
                          className="font-black text-sm text-white hover:text-[#5f86ff] line-clamp-2 transition-colors"
                        >
                          {m.title}
                        </Link>
                        <div className="text-[11px] text-[#93a9c7] font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#5f86ff] shrink-0" /> {m.city}, {m.state}
                        </div>
                      </div>

                      {/* Price Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-[#5f86ff]">{m.formattedPrice}</span>
                        {m.verifiedStatus === 'verified' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-xs text-[#93a9c7] font-medium">
            {/* SECTION: BASIC SPECIFICATIONS */}
            <tr className="bg-white/10 text-white">
              <td colSpan={comparedMetrics.length + 1} className="p-3 font-extrabold text-[11px] tracking-wider uppercase flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#5f86ff]" /> 1. Core Property Specifications
              </td>
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Price / Sqft Rate</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4">
                  <span className={`font-mono font-extrabold px-2.5 py-1 rounded-lg ${m.pricePerSqft === minPricePerSqft ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'glass-panel text-white'}`}>
                    {m.formattedPricePerSqft} {m.pricePerSqft === minPricePerSqft && '🏷️ Best Rate'}
                  </span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Total Carpet Area</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4">
                  <span className={`font-bold ${m.sizeSqft === maxSqft ? 'text-[#5f86ff] font-black' : 'text-white'}`}>
                    {m.sizeSqft.toLocaleString()} sqft {m.sizeSqft === maxSqft && '📐 Largest'}
                  </span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Bedrooms & Baths</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4 font-semibold text-[#eaf2ff]">
                  {m.bedrooms} BHK ({m.bedrooms} Beds / {m.bathrooms} Baths)
                </td>
              ))}
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Property Type & Format</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4 capitalize font-semibold text-[#93a9c7]">
                  {m.propertyType} ({m.type === 'sale' ? 'For Sale' : 'For Rent'})
                </td>
              ))}
            </tr>

            {/* SECTION: FINANCIAL & ROI METRICS */}
            <tr className="bg-white/10 text-white">
              <td colSpan={comparedMetrics.length + 1} className="p-3 font-extrabold text-[11px] tracking-wider uppercase flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" /> 2. Financial & Investment ROI Metrics
              </td>
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Projected 10-Yr ROI</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4">
                  <div className={`space-y-0.5 font-bold ${m.estimated10YrReturn === maxRoi ? 'text-emerald-400 font-black' : 'text-white'}`}>
                    <span className="text-sm font-extrabold text-emerald-400">+{m.estimated10YrReturn}%</span>
                    <span className="text-[10px] text-[#93a9c7] block">Est. Value: {m.formatted10YrValue}</span>
                  </div>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Estimated Rental Yield (Cap Rate)</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4 font-extrabold text-[#5f86ff]">
                  {m.estimatedCapRate}% / yr
                </td>
              ))}
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Est. Monthly Home Loan EMI</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4 font-mono font-bold text-amber-400">
                  {m.formattedMonthlyEMI}
                  <span className="text-[9.5px] text-[#93a9c7] block font-sans">@ 8.5% 20-Yr Loan</span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Est. Stamp Duty & Reg. Fee (6%)</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4 text-[#93a9c7] font-mono">
                  {m.formattedStampDuty}
                </td>
              ))}
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Est. Monthly Society Maintenance</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4 text-[#93a9c7] font-mono">
                  {m.formattedMaintenanceMonthly}
                </td>
              ))}
            </tr>

            {/* SECTION: AI NEIGHBORHOOD & LIVABILITY */}
            <tr className="bg-white/10 text-white">
              <td colSpan={comparedMetrics.length + 1} className="p-3 font-extrabold text-[11px] tracking-wider uppercase flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" /> 3. AI Neighborhood & Livability Scores
              </td>
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Walkability Score</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4">
                  <span className="font-extrabold text-emerald-400">{m.walkScore} / 100</span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Safety & Security Index</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4">
                  <span className="font-extrabold text-[#5f86ff]">{m.safetyScore} / 100</span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Public Transit Score</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4">
                  <span className="font-bold text-purple-400">{m.transitScore} / 100</span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Top School Rating</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4">
                  <span className="font-bold text-amber-400">{m.schoolRating} / 10</span>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white bg-[#030a14]/90 sticky left-0 z-10">Air Quality Index (AQI)</td>
              {comparedMetrics.map(m => (
                <td key={m.id} className="p-4 font-semibold text-[#93a9c7]">
                  {m.aqiRating}
                </td>
              ))}
            </tr>

            {/* SECTION: FULL AMENITIES GRID */}
            <tr className="bg-white/10 text-white">
              <td colSpan={comparedMetrics.length + 1} className="p-3 font-extrabold text-[11px] tracking-wider uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> 4. Full Amenities Comparison Matrix
              </td>
            </tr>

            {allAmenities.map(amenity => (
              <tr key={amenity} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-semibold text-white bg-[#030a14]/90 sticky left-0 z-10">{amenity}</td>
                {properties.map(p => {
                  const hasAmenity = p.amenities?.some(a => a.toLowerCase() === amenity.toLowerCase());
                  return (
                    <td key={p.id} className="p-4">
                      {hasAmenity ? (
                        <span className="inline-flex items-center gap-1 text-emerald-300 font-bold bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#93a9c7] glass-panel px-2.5 py-1 rounded-lg">
                          <X className="w-3.5 h-3.5 text-[#93a9c7]" /> N/A
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 360° Virtual Tour Viewer Modal */}
      {activeTourProperty && (
        <div className="fixed inset-0 z-50 bg-[#030a14]/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-5xl flex items-center justify-between py-3 text-white">
            <h3 className="font-bold text-base">360° Interactive Virtual Tour — {activeTourProperty.title}</h3>
            <button
              onClick={() => setActiveTourProperty(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative w-full max-w-5xl aspect-16/9 glass-card rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <VirtualTourViewer
              tourUrl={activeTourProperty.media?.find(m => m.type === 'tour360')?.mediaUrl}
              propertyTitle={activeTourProperty.title}
              isEmbedded={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
