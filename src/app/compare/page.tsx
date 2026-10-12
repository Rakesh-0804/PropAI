'use client';

import React, { useState, useEffect } from 'react';
import CompareMatrix from '@/components/CompareMatrix';
import AICompareSummary from '@/components/AICompareSummary';
import { Property, formatINR } from '@/types';
import { Scale, Plus, RefreshCw, Printer, Trash2, Sparkles, Building2, Search, X } from 'lucide-react';

export default function ComparePage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      const props: Property[] = data.properties || [];
      setAllProperties(props);

      const compareIds: string[] = JSON.parse(localStorage.getItem('compare_ids') || '[]');
      let filtered = props.filter(p => compareIds.includes(p.id));

      if (filtered.length === 0 && props.length > 0) {
        filtered = props.slice(0, 3);
        localStorage.setItem('compare_ids', JSON.stringify(filtered.map(p => p.id)));
      }

      setComparedProperties(filtered);
    } catch (err) {
      console.error('Failed to load comparison properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id: string) => {
    const updated = comparedProperties.filter(p => p.id !== id);
    setComparedProperties(updated);
    const updatedIds = updated.map(p => p.id);
    localStorage.setItem('compare_ids', JSON.stringify(updatedIds));
  };

  const handleClearAll = () => {
    setComparedProperties([]);
    localStorage.setItem('compare_ids', JSON.stringify([]));
  };

  const handleAddProperty = (id: string) => {
    if (!id) return;
    if (comparedProperties.length >= 4) {
      alert('Maximum 4 properties can be compared at once.');
      return;
    }
    const target = allProperties.find(p => p.id === id);
    if (target && !comparedProperties.some(p => p.id === id)) {
      const updated = [...comparedProperties, target];
      setComparedProperties(updated);
      localStorage.setItem('compare_ids', JSON.stringify(updated.map(p => p.id)));
    }
  };

  const loadPresetBundle = (cityKeyword: string) => {
    const matching = allProperties.filter(p => p.city.toLowerCase().includes(cityKeyword.toLowerCase())).slice(0, 3);
    if (matching.length > 0) {
      setComparedProperties(matching);
      localStorage.setItem('compare_ids', JSON.stringify(matching.map(p => p.id)));
    }
  };

  const filteredPickerList = allProperties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchFilter.toLowerCase()) || p.city.toLowerCase().includes(searchFilter.toLowerCase()) || p.propertyType.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCity = cityFilter === 'all' || p.city.toLowerCase().includes(cityFilter.toLowerCase());
    return matchesSearch && matchesCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#eaf2ff]">
      {/* Header & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/15 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#5f86ff] font-extrabold text-xs uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" /> Multi-Property Side-by-Side Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            AI Executive Property Comparison Matrix
          </h1>
          <p className="text-xs text-[#93a9c7] mt-1">
            Side-by-side technical evaluation of prices, 10-Yr ROI projections, EMI estimates, livability index scores, and complete amenity density.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {comparedProperties.length > 0 && (
            <button
              onClick={() => window.print()}
              className="chip chip-active text-xs font-bold gap-1.5 cursor-pointer"
              title="Print comparison matrix"
            >
              <Printer className="w-4 h-4" /> Export / Print PDF
            </button>
          )}

          {comparedProperties.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-2 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-xl text-xs font-bold border border-rose-500/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Matrix
            </button>
          )}

          <button
            onClick={() => setShowPickerModal(true)}
            className="btn-primary py-2 px-4 text-xs font-bold gap-2 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Property ({comparedProperties.length}/4)
          </button>
        </div>
      </div>

      {/* Preset Quick Loaders */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/15 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-[#93a9c7]">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Quick 1-Click Comparison Presets:</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => loadPresetBundle('Mumbai')}
            className="chip hover:chip-active text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            🏢 Mumbai Metro Luxury
          </button>
          <button
            onClick={() => loadPresetBundle('Bangalore')}
            className="chip hover:chip-active text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            🌳 Bengaluru Tech & Villas
          </button>
          <button
            onClick={() => loadPresetBundle('Delhi')}
            className="chip hover:chip-active text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            🏰 Delhi NCR Estates
          </button>
          <button
            onClick={() => loadPresetBundle('Goa')}
            className="chip hover:chip-active text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            🌴 Goa Coastal Escapes
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#5f86ff] animate-spin mx-auto" />
          <p className="text-xs text-[#93a9c7] font-semibold">Loading real-time comparison metrics...</p>
        </div>
      ) : (
        <>
          <AICompareSummary properties={comparedProperties} />
          <CompareMatrix properties={comparedProperties} onRemove={handleRemove} />
        </>
      )}

      {/* Property Selector Drawer / Modal */}
      {showPickerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-6 shadow-2xl border border-white/20 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-white/15 pb-3">
              <div>
                <h3 className="font-black text-white text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#5f86ff]" /> Select Property to Compare
                </h3>
                <p className="text-xs text-[#93a9c7]">Search 300+ verified listings across all metropolitan corridors.</p>
              </div>
              <button
                onClick={() => setShowPickerModal(false)}
                className="p-1.5 text-[#93a9c7] hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-[#93a9c7] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search title, city, or property type..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full glass-input pl-9 pr-3 py-2 text-white font-medium"
                />
              </div>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-slate-900/80 border border-white/20 text-white font-bold px-3 py-2 rounded-xl focus:border-[#5f86ff]"
              >
                <option value="all" className="bg-slate-900 text-white">All Metro Cities</option>
                <option value="Mumbai" className="bg-slate-900 text-white">Mumbai MMR</option>
                <option value="Bangalore" className="bg-slate-900 text-white">Bengaluru</option>
                <option value="Delhi" className="bg-slate-900 text-white">Delhi NCR</option>
                <option value="Hyderabad" className="bg-slate-900 text-white">Hyderabad</option>
                <option value="Pune" className="bg-slate-900 text-white">Pune</option>
                <option value="Goa" className="bg-slate-900 text-white">Goa</option>
                <option value="Chennai" className="bg-slate-900 text-white">Chennai</option>
                <option value="Kochi" className="bg-slate-900 text-white">Kochi</option>
              </select>
            </div>

            {/* Property Selector List */}
            <div className="overflow-y-auto space-y-2 flex-1 pr-1 text-xs">
              {filteredPickerList.map((p) => {
                const isSelected = comparedProperties.some(cp => cp.id === p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (isSelected) {
                        handleRemove(p.id);
                      } else {
                        handleAddProperty(p.id);
                      }
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected ? 'bg-[#5f86ff]/20 border-[#5f86ff]/40' : 'glass-panel hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-slate-900 shrink-0">
                        <img
                          src={p.media?.[0]?.mediaUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'}
                          alt={p.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white line-clamp-1">{p.title}</h4>
                        <div className="text-[11px] text-[#93a9c7] font-medium">
                          {p.city} • {p.bedrooms} BHK • {p.sizeSqft} sqft
                        </div>
                        <span className="font-extrabold text-[#5f86ff] block mt-0.5">{formatINR(p.price)}</span>
                      </div>
                    </div>

                    <button
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition-colors ${
                        isSelected
                          ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                          : 'btn-primary py-1.5 px-3'
                      }`}
                    >
                      {isSelected ? 'Remove' : '+ Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
