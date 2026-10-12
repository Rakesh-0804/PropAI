'use client';

import React, { useState, useEffect } from 'react';
import PropertyFilter from '@/components/PropertyFilter';
import PropertyCard from '@/components/PropertyCard';
import PropertyMap from '@/components/PropertyMap';
import AINLPSearchBar from '@/components/AINLPSearchBar';
import { Property, PropertyFilterParams, formatINR } from '@/types';
import { LayoutGrid, Map, Scale, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>();
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState<number>(18);

  const [filters, setFilters] = useState<PropertyFilterParams>({
    search: '',
    city: '',
    type: '',
    propertyType: '',
    bedrooms: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    verifiedOnly: false,
    sortBy: 'newest',
  });

  useEffect(() => {
    fetchProperties();
    const savedCompare = JSON.parse(localStorage.getItem('compare_ids') || '[]');
    setComparedIds(savedCompare);
  }, []);

  // Reset display count whenever filters change to ensure instant rendering
  useEffect(() => {
    setDisplayCount(18);
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      setProperties(data.properties || []);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareToggle = (id: string, isSelected: boolean) => {
    let updated = [...comparedIds];
    if (isSelected) {
      if (updated.length >= 4) {
        alert('You can compare a maximum of 4 properties at once.');
        return;
      }
      if (!updated.includes(id)) updated.push(id);
    } else {
      updated = updated.filter(item => item !== id);
    }
    setComparedIds(updated);
    localStorage.setItem('compare_ids', JSON.stringify(updated));
  };

  // Filter and sort properties with useMemo for instant UI response
  const filteredProperties = React.useMemo(() => {
    let result = properties.filter((prop) => {
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const matches =
          prop.title.toLowerCase().includes(q) ||
          prop.city.toLowerCase().includes(q) ||
          prop.address?.toLowerCase().includes(q) ||
          prop.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (filters.city && prop.city.toLowerCase() !== filters.city.toLowerCase()) return false;
      if (filters.type && prop.type !== filters.type) return false;
      if (filters.propertyType && prop.propertyType.toLowerCase() !== filters.propertyType.toLowerCase()) return false;
      if (filters.bedrooms !== undefined && filters.bedrooms !== null && Number(filters.bedrooms) > 0) {
        const minBeds = Number(filters.bedrooms);
        const propBeds = Number(prop.bedrooms);
        if (isNaN(propBeds) || propBeds < minBeds) return false;
      }
      if (filters.minPrice !== undefined && filters.minPrice !== null && Number(filters.minPrice) > 0) {
        if (Number(prop.price) < Number(filters.minPrice)) return false;
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null && Number(filters.maxPrice) > 0) {
        if (Number(prop.price) > Number(filters.maxPrice)) return false;
      }
      if (filters.verifiedOnly && prop.verifiedStatus !== 'verified') return false;
      return true;
    });

    if (filters.sortBy === 'price_asc') {
      return [...result].sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      return [...result].sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'match_score') {
      return [...result].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return result;
  }, [properties, filters]);

  const visibleProperties = filteredProperties.slice(0, displayCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#eaf2ff] tracking-tight">
            Explore Real Estate Properties
          </h1>
          <p className="text-xs text-[#93a9c7] mt-1">
            Showing <span className="font-bold text-white">{visibleProperties.length}</span> of <span className="font-bold text-white">{filteredProperties.length}</span> verified listings
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Comparison Bar */}
          {comparedIds.length > 0 && (
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30 rounded-xl text-xs font-bold hover:bg-[#5f86ff]/30 transition-colors shadow-md"
            >
              <Scale className="w-4 h-4" /> Compare ({comparedIds.length})
            </Link>
          )}

          {/* View Toggle */}
          <div className="flex items-center glass p-1 border border-white/15">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-[#5f86ff] text-white shadow-md' : 'text-[#93a9c7] hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map' ? 'bg-[#5f86ff] text-white shadow-md' : 'text-[#93a9c7] hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" /> Map View
            </button>
          </div>
        </div>
      </div>

      {/* Affordable Properties Under 20 Lakhs Highlight Banner */}
      <div className="glass-card p-4 border border-amber-400/30 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 backdrop-blur flex items-center justify-center text-xl shrink-0 font-bold">
            🏷️
          </div>
          <div>
            <h3 className="text-sm font-black text-amber-300 tracking-tight">Affordable Housing Special: Properties Under ₹20 Lakhs</h3>
            <p className="text-xs text-[#93a9c7] font-medium">Over 30+ verified 1 BHK flats, studio apartments, plots, & compact homes priced under ₹20 Lakhs.</p>
          </div>
        </div>
        <button
          onClick={() => setFilters(prev => ({ ...prev, maxPrice: 2000000 }))}
          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold rounded-xl text-xs shrink-0 transition-all shadow-md hover:from-amber-400 hover:to-orange-400 cursor-pointer"
        >
          View &lt; ₹20 Lakhs Properties ({properties.filter(p => p.price <= 2000000).length} Available)
        </button>
      </div>

      {/* AI Natural Language Search Component */}
      <AINLPSearchBar
        onResultsFound={(results) => {
          if (results && results.length > 0) {
            setProperties(results);
          }
        }}
      />

      {/* Active Budget Status Banner */}
      {(filters.maxPrice || filters.minPrice) && (
        <div className="glass-panel p-3 flex flex-wrap items-center justify-between text-xs font-bold text-[#eaf2ff] border border-[#5f86ff]/30 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5f86ff] animate-ping" />
            <span>
              🏷️ Active Budget Filter:{' '}
              {filters.minPrice && filters.maxPrice
                ? `${formatINR(filters.minPrice)} to ${formatINR(filters.maxPrice)}`
                : filters.maxPrice
                ? `Up to ${formatINR(filters.maxPrice)}`
                : `From ${formatINR(filters.minPrice!)} & above`}
              {' '}({filteredProperties.length} Properties Matching)
            </span>
          </div>
          <button
            onClick={() => setFilters(prev => ({ ...prev, minPrice: undefined, maxPrice: undefined }))}
            className="text-rose-400 hover:underline cursor-pointer font-extrabold"
          >
            ✕ Show All Budgets
          </button>
        </div>
      )}

      {/* Filter Component */}
      <PropertyFilter
        filters={filters}
        onChange={setFilters}
        onReset={() =>
          setFilters({
            search: '',
            city: '',
            type: '',
            propertyType: '',
            bedrooms: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            verifiedOnly: false,
            sortBy: 'newest',
          })
        }
      />

      {/* Content Layout */}
      {loading ? (
        <div className="py-20 text-center text-[#93a9c7] font-semibold text-sm">
          Loading properties...
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="py-16 text-center glass-card p-8 space-y-3">
          <p className="text-[#93a9c7] font-semibold text-sm">No properties match your active filters.</p>
          <button
            onClick={() =>
              setFilters({
                search: '',
                city: '',
                type: '',
                propertyType: '',
                bedrooms: undefined,
                maxPrice: undefined,
                verifiedOnly: false,
                sortBy: 'newest',
              })
            }
            className="btn-primary px-4 py-2 text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onCompareToggle={handleCompareToggle}
                isCompared={comparedIds.includes(prop.id)}
              />
            ))}
          </div>

          {/* Load More Button for Instant Pagination & High Speed */}
          {displayCount < filteredProperties.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setDisplayCount(prev => prev + 18)}
                className="btn-primary py-3 px-8 text-xs font-extrabold gap-2 shadow-xl hover:scale-105 transition-all"
              >
                Load More Properties ({filteredProperties.length - displayCount} Remaining) <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          {/* Left Column: Properties List */}
          <div className="lg:col-span-5 space-y-4 max-h-[650px] overflow-y-auto pr-1">
            {visibleProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => setSelectedPropertyId(prop.id)}
                className={`cursor-pointer transition-all ${
                  selectedPropertyId === prop.id ? 'ring-2 ring-[#5f86ff] rounded-2xl' : ''
                }`}
              >
                <PropertyCard
                  property={prop}
                  onCompareToggle={handleCompareToggle}
                  isCompared={comparedIds.includes(prop.id)}
                />
              </div>
            ))}

            {displayCount < filteredProperties.length && (
              <button
                onClick={() => setDisplayCount(prev => prev + 18)}
                className="w-full btn-primary py-2.5 text-xs font-extrabold gap-1"
              >
                Load More ({filteredProperties.length - displayCount} Remaining)
              </button>
            )}
          </div>

          {/* Right Column: Interactive Map */}
          <div className="lg:col-span-7 h-[650px] rounded-2xl overflow-hidden glass border border-white/15">
            <PropertyMap
              properties={filteredProperties}
              selectedPropertyId={selectedPropertyId}
              onSelectProperty={(p) => setSelectedPropertyId(p.id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
