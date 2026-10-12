'use client';

import React from 'react';
import { Search, Filter, SlidersHorizontal, ShieldCheck, RefreshCw } from 'lucide-react';
import { PropertyFilterParams } from '@/types';

interface PropertyFilterProps {
  filters: PropertyFilterParams;
  onChange: (filters: PropertyFilterParams) => void;
  onReset: () => void;
}

export default function PropertyFilter({ filters, onChange, onReset }: PropertyFilterProps) {
  const handleChange = (key: keyof PropertyFilterParams, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="glass-card p-5 border border-white/15 shadow-2xl space-y-4 text-[#eaf2ff]">
      {/* Top Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-[#93a9c7] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by city, title, or keywords..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full glass-input pl-11 pr-4 py-2.5 text-sm font-medium"
        />
      </div>

      {/* Filter Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* City Filter */}
        <div>
          <label className="block text-xs font-semibold text-[#93a9c7] mb-1">City / Region</label>
          <select
            value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900/80 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#5f86ff]"
          >
            <option value="" className="bg-slate-900 text-white">All Cities (Global & India)</option>
            <optgroup label="🇮🇳 Indian Metro Cities" className="bg-slate-900 text-[#5f86ff]">
              <option value="Mumbai" className="bg-slate-900 text-white">Mumbai MMR</option>
              <option value="Bangalore" className="bg-slate-900 text-white">Bengaluru</option>
              <option value="Delhi NCR" className="bg-slate-900 text-white">Delhi NCR</option>
              <option value="Hyderabad" className="bg-slate-900 text-white">Hyderabad</option>
              <option value="Pune" className="bg-slate-900 text-white">Pune</option>
              <option value="Goa" className="bg-slate-900 text-white">Goa</option>
              <option value="Chennai" className="bg-slate-900 text-white">Chennai</option>
              <option value="Kolkata" className="bg-slate-900 text-white">Kolkata</option>
              <option value="Kochi" className="bg-slate-900 text-white">Kochi</option>
              <option value="Ahmedabad" className="bg-slate-900 text-white">Ahmedabad</option>
            </optgroup>
            <optgroup label="🌍 International Cities" className="bg-slate-900 text-[#5f86ff]">
              <option value="New York" className="bg-slate-900 text-white">New York, USA</option>
              <option value="London" className="bg-slate-900 text-white">London, UK</option>
              <option value="Dubai" className="bg-slate-900 text-white">Dubai, UAE</option>
              <option value="Singapore" className="bg-slate-900 text-white">Singapore</option>
              <option value="Tokyo" className="bg-slate-900 text-white">Tokyo, Japan</option>
              <option value="Paris" className="bg-slate-900 text-white">Paris, France</option>
              <option value="Sydney" className="bg-slate-900 text-white">Sydney, Australia</option>
              <option value="Toronto" className="bg-slate-900 text-white">Toronto, Canada</option>
              <option value="Los Angeles" className="bg-slate-900 text-white">Los Angeles, USA</option>
              <option value="Miami" className="bg-slate-900 text-white">Miami, USA</option>
              <option value="Bali" className="bg-slate-900 text-white">Bali, Indonesia</option>
            </optgroup>
          </select>
        </div>

        {/* Listing Purpose */}
        <div>
          <label className="block text-xs font-semibold text-[#93a9c7] mb-1">Purpose</label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900/80 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#5f86ff]"
          >
            <option value="" className="bg-slate-900 text-white">Sale & Rent</option>
            <option value="sale" className="bg-slate-900 text-white">For Sale</option>
            <option value="rent" className="bg-slate-900 text-white">For Rent</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-xs font-semibold text-[#93a9c7] mb-1">Property Type</label>
          <select
            value={filters.propertyType || ''}
            onChange={(e) => handleChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900/80 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#5f86ff]"
          >
            <option value="" className="bg-slate-900 text-white">All Property Types</option>
            <option value="apartment" className="bg-slate-900 text-white">Apartment</option>
            <option value="house" className="bg-slate-900 text-white">House</option>
            <option value="independent_house" className="bg-slate-900 text-white">Independent House / Villa</option>
            <option value="villa" className="bg-slate-900 text-white">Luxury Villa</option>
            <option value="condo" className="bg-slate-900 text-white">Condo / High-Rise</option>
            <option value="builder_floor" className="bg-slate-900 text-white">Builder Floor</option>
            <option value="farmhouse" className="bg-slate-900 text-white">Farmhouse / Estate</option>
            <option value="commercial" className="bg-slate-900 text-white">Commercial Space</option>
            <option value="plot" className="bg-slate-900 text-white">Plot / Land Site</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-xs font-semibold text-[#93a9c7] mb-1">Min Bedrooms</label>
          <select
            value={filters.bedrooms !== undefined && filters.bedrooms !== null && filters.bedrooms > 0 ? String(filters.bedrooms) : ''}
            onChange={(e) => {
              const val = e.target.value;
              handleChange('bedrooms', val ? Number(val) : undefined);
            }}
            className="w-full px-3 py-2 bg-slate-900/80 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#5f86ff]"
          >
            <option value="" className="bg-slate-900 text-white">Any Bedrooms</option>
            <option value="1" className="bg-slate-900 text-white">1+ Bed</option>
            <option value="2" className="bg-slate-900 text-white">2+ Beds</option>
            <option value="3" className="bg-slate-900 text-white">3+ Beds</option>
            <option value="4" className="bg-slate-900 text-white">4+ Beds</option>
            <option value="5" className="bg-slate-900 text-white">5+ Beds</option>
          </select>
        </div>
      </div>

      {/* Quick Budget Chips Bar */}
      <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
        <span className="font-bold text-[#93a9c7] mr-1">Quick Budget Filters:</span>
        <button
          type="button"
          onClick={() => onChange({ ...filters, minPrice: undefined, maxPrice: undefined })}
          className={`chip cursor-pointer ${
            !filters.maxPrice && !filters.minPrice ? 'chip-active' : ''
          }`}
        >
          All Budgets
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...filters, minPrice: undefined, maxPrice: 2000000 })}
          className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 border cursor-pointer ${
            filters.maxPrice === 2000000 && !filters.minPrice
              ? 'bg-amber-500/30 text-amber-300 border-amber-400/60 ring-2 ring-amber-400/40 shadow-lg scale-105'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
          }`}
        >
          🔥 Under ₹20 Lakhs (&lt; 20L)
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...filters, minPrice: 2000000, maxPrice: 5000000 })}
          className={`chip cursor-pointer ${
            filters.minPrice === 2000000 && filters.maxPrice === 5000000 ? 'chip-active' : ''
          }`}
        >
          ₹20L - ₹50L
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...filters, minPrice: 5000000, maxPrice: 10000000 })}
          className={`chip cursor-pointer ${
            filters.minPrice === 5000000 && filters.maxPrice === 10000000 ? 'chip-active' : ''
          }`}
        >
          ₹50L - ₹1 Cr
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...filters, minPrice: 10000000, maxPrice: 30000000 })}
          className={`chip cursor-pointer ${
            filters.minPrice === 10000000 && filters.maxPrice === 30000000 ? 'chip-active' : ''
          }`}
        >
          ₹1 Cr - ₹3 Cr
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...filters, minPrice: 30000000, maxPrice: undefined })}
          className={`chip cursor-pointer ${
            filters.minPrice === 30000000 && !filters.maxPrice ? 'chip-active' : ''
          }`}
        >
          ₹3 Cr+
        </button>

        {(filters.maxPrice || filters.minPrice) && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, minPrice: undefined, maxPrice: undefined })}
            className="px-2 py-1 text-[11px] font-bold text-rose-400 hover:underline cursor-pointer"
          >
            ✕ Reset Budget
          </button>
        )}
      </div>

      {/* Filter Row 2: Price Range & Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/15 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Max Price Select */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#93a9c7] font-bold">Max Budget Limit:</span>
            <select
              value={filters.maxPrice ? String(filters.maxPrice) : ''}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('maxPrice', val ? Number(val) : undefined);
              }}
              className="px-3 py-1.5 bg-slate-900/80 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#5f86ff] cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-white">Any Budget (Show All Properties)</option>
              <option value="2000000" className="bg-slate-900 text-white">🔥 Under ₹20 Lakhs (70+ Properties)</option>
              <option value="3000000" className="bg-slate-900 text-white">Under ₹30 Lakhs</option>
              <option value="5000000" className="bg-slate-900 text-white">Under ₹50 Lakhs</option>
              <option value="7500000" className="bg-slate-900 text-white">Under ₹75 Lakhs</option>
              <option value="10000000" className="bg-slate-900 text-white">Under ₹1 Crore</option>
              <option value="20000000" className="bg-slate-900 text-white">Under ₹2 Crores</option>
              <option value="50000000" className="bg-slate-900 text-white">Under ₹5 Crores</option>
              <option value="100000000" className="bg-slate-900 text-white">Under ₹10 Crores</option>
            </select>
          </div>

          {/* Verified Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#93a9c7] hover:text-white">
            <input
              type="checkbox"
              checked={filters.verifiedOnly || false}
              onChange={(e) => handleChange('verifiedOnly', e.target.checked)}
              className="rounded border-white/30 bg-white/10 text-[#5f86ff] focus:ring-[#5f86ff]"
            />
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Only
          </label>
        </div>

        {/* Sorting & Reset */}
        <div className="flex items-center gap-3">
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="px-3 py-1.5 bg-slate-900/80 border border-white/20 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#5f86ff]"
          >
            <option value="newest" className="bg-slate-900 text-white">Newest First</option>
            <option value="price_asc" className="bg-slate-900 text-white">Price: Low to High</option>
            <option value="price_desc" className="bg-slate-900 text-white">Price: High to Low</option>
            <option value="match_score" className="bg-slate-900 text-white">Highest AI Match</option>
          </select>

          <button
            onClick={onReset}
            className="p-2 rounded-xl text-[#93a9c7] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
