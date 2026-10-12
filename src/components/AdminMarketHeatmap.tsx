'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  MapPin,
  TrendingUp,
  TrendingDown,
  Layers,
  Radio,
  Megaphone,
  Users,
  Target,
  ShieldAlert,
  CheckCircle2,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Filter,
  Check,
} from 'lucide-react';
import { Property, formatINR } from '@/types';

interface MarketZoneData {
  id: string;
  neighborhood: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  monthlySearches: number;
  activeListings: number;
  demandSupplyRatio: number; // e.g. 4.8 means 4.8x demand vs supply
  status: 'HIGH_DEMAND' | 'BALANCED' | 'OVERSUPPLIED';
  avgPriceSqft: number;
  recommendedCampaign: string;
  marketingAction: string;
}

interface AdminMarketHeatmapProps {
  properties?: Property[];
}

export default function AdminMarketHeatmap({ properties = [] }: AdminMarketHeatmapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('ALL');
  const [selectedZone, setSelectedZone] = useState<MarketZoneData | null>(null);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [campaignLaunched, setCampaignLaunched] = useState(false);

  // Market Demand & Supply Zones Database Across Cities
  const marketZones: MarketZoneData[] = [
    {
      id: 'zone-1',
      neighborhood: 'Bandra West',
      city: 'Mumbai',
      country: 'India',
      lat: 19.0596,
      lng: 72.8295,
      monthlySearches: 38400,
      activeListings: 18,
      demandSupplyRatio: 5.2,
      status: 'HIGH_DEMAND',
      avgPriceSqft: 48500,
      recommendedCampaign: '⚡ Seller Onboarding Sprint - High Inventory Deficit',
      marketingAction: 'Deploy Google Ads & Broker Referral Bonuses in Bandra to capture luxury sellers.',
    },
    {
      id: 'zone-2',
      neighborhood: 'Lower Parel',
      city: 'Mumbai',
      country: 'India',
      lat: 18.9986,
      lng: 72.8302,
      monthlySearches: 29100,
      activeListings: 15,
      demandSupplyRatio: 4.1,
      status: 'HIGH_DEMAND',
      avgPriceSqft: 42000,
      recommendedCampaign: '🏢 Commercial & Sky Villa Seller Drive',
      marketingAction: 'Target ultra-hni corporate landlords for high-floor condo listings.',
    },
    {
      id: 'zone-3',
      neighborhood: 'Indiranagar 100ft Rd',
      city: 'Bangalore',
      country: 'India',
      lat: 12.9784,
      lng: 77.6408,
      monthlySearches: 31200,
      activeListings: 14,
      demandSupplyRatio: 4.8,
      status: 'HIGH_DEMAND',
      avgPriceSqft: 16800,
      recommendedCampaign: '🚀 Gated Villa & Luxury Plot Acquisition Campaign',
      marketingAction: 'Run targeted social ads for Bangalore tech founders seeking luxury homes.',
    },
    {
      id: 'zone-4',
      neighborhood: 'Whitefield IT Corridor',
      city: 'Bangalore',
      country: 'India',
      lat: 12.9698,
      lng: 77.7499,
      monthlySearches: 18500,
      activeListings: 32,
      demandSupplyRatio: 1.1,
      status: 'OVERSUPPLIED',
      avgPriceSqft: 9200,
      recommendedCampaign: '📉 Buyer Incentive & Discount Promotion',
      marketingAction: 'Run targeted buyer campaigns featuring 0% processing fee & developer cashbacks.',
    },
    {
      id: 'zone-5',
      neighborhood: 'DLF Phase 5 Gurugram',
      city: 'Delhi NCR',
      country: 'India',
      lat: 28.4485,
      lng: 77.0931,
      monthlySearches: 34000,
      activeListings: 16,
      demandSupplyRatio: 4.5,
      status: 'HIGH_DEMAND',
      avgPriceSqft: 24500,
      recommendedCampaign: '🏰 Golf Course Road Luxury Penthouse Campaign',
      marketingAction: 'Target HNI investors looking for 4+ BHK penthouses in Gurugram.',
    },
    {
      id: 'zone-6',
      neighborhood: 'Jubilee Hills Road 36',
      city: 'Hyderabad',
      country: 'India',
      lat: 17.4319,
      lng: 78.4073,
      monthlySearches: 26500,
      activeListings: 12,
      demandSupplyRatio: 4.6,
      status: 'HIGH_DEMAND',
      avgPriceSqft: 19200,
      recommendedCampaign: '💎 Cyberabad HNI Villa Acquisition Drive',
      marketingAction: 'Engage local luxury brokers for exclusive Jubilee Hills estate listings.',
    },
    {
      id: 'zone-7',
      neighborhood: 'Koregaon Park',
      city: 'Pune',
      country: 'India',
      lat: 18.5362,
      lng: 73.894,
      monthlySearches: 22100,
      activeListings: 19,
      demandSupplyRatio: 2.8,
      status: 'BALANCED',
      avgPriceSqft: 14500,
      recommendedCampaign: '🎯 Balanced Growth - Featured Placement Optimization',
      marketingAction: 'Maintain steady PPC ad spend with spotlight cards on premier builder floors.',
    },
    {
      id: 'zone-8',
      neighborhood: 'Anjuna Beachfront Corridor',
      city: 'Goa',
      country: 'India',
      lat: 15.5873,
      lng: 73.7374,
      monthlySearches: 29800,
      activeListings: 11,
      demandSupplyRatio: 5.1,
      status: 'HIGH_DEMAND',
      avgPriceSqft: 22000,
      recommendedCampaign: '🌴 Vacation Rental & Heritage Villa Campaign',
      marketingAction: 'Run nationwide campaigns targeting vacation home buyers in Goa.',
    },
    {
      id: 'zone-9',
      neighborhood: 'Tribeca Waterfront',
      city: 'New York',
      country: 'USA',
      lat: 40.7163,
      lng: -74.0086,
      monthlySearches: 42000,
      activeListings: 10,
      demandSupplyRatio: 5.8,
      status: 'HIGH_DEMAND',
      avgPriceSqft: 185000, // INR equivalent per sqft
      recommendedCampaign: '🌍 Global HNI Penthouse Campaign',
      marketingAction: 'Target international luxury buyers for Tribeca loft acquisitions.',
    },
    {
      id: 'zone-10',
      neighborhood: 'Mayfair Crescent',
      city: 'London',
      country: 'UK',
      lat: 51.5095,
      lng: -0.1495,
      monthlySearches: 39500,
      activeListings: 9,
      demandSupplyRatio: 6.1,
      status: 'HIGH_DEMAND',
      avgPriceSqft: 195000,
      recommendedCampaign: '👑 Prime Central London Luxury Campaign',
      marketingAction: 'Deploy exclusive digital showcases for Mayfair townhouse inventory.',
    },
    {
      id: 'zone-11',
      neighborhood: 'Palm Jumeirah Ocean',
      city: 'Dubai',
      country: 'UAE',
      lat: 25.1124,
      lng: 55.139,
      monthlySearches: 45000,
      activeListings: 14,
      demandSupplyRatio: 5.4,
      status: 'HIGH_DEMAND',
      avgPriceSqft: 142000,
      recommendedCampaign: '🌴 Waterfront Palm Villa Sprint',
      marketingAction: 'Target global investors with 0% tax & high rental yield messaging.',
    },
    {
      id: 'zone-12',
      neighborhood: 'OMR IT Highway Corridor',
      city: 'Chennai',
      country: 'India',
      lat: 12.9103,
      lng: 80.2281,
      monthlySearches: 14200,
      activeListings: 38,
      demandSupplyRatio: 0.7,
      status: 'OVERSUPPLIED',
      avgPriceSqft: 6800,
      recommendedCampaign: '📢 Buyer Cashback & Low Down-Payment Promotion',
      marketingAction: 'Run targeted promo ads offering waived registration fees to clear inventory.',
    },
  ];

  const filteredZones = marketZones.filter((zone) => {
    if (selectedCityFilter === 'ALL') return true;
    if (selectedCityFilter === 'INDIA') return zone.country === 'India';
    if (selectedCityFilter === 'INTL') return zone.country !== 'India';
    return zone.city.toLowerCase() === selectedCityFilter.toLowerCase();
  });

  useEffect(() => {
    // Inject Leaflet CSS dynamically if missing
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Default Leaflet center
      const center: [number, number] = [20.5937, 78.9629]; // India center overview

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current).setView(center, 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        mapInstanceRef.current = map;
        layerGroupRef.current = L.layerGroup().addTo(map);
      }

      const map = mapInstanceRef.current;
      const layerGroup = layerGroupRef.current;
      layerGroup.clearLayers();

      // Render spatial heatmap circles for each filtered zone
      filteredZones.forEach((zone) => {
        const isHighDemand = zone.status === 'HIGH_DEMAND';
        const isOversupplied = zone.status === 'OVERSUPPLIED';

        const color = isHighDemand ? '#ef4444' : isOversupplied ? '#10b981' : '#f59e0b';
        const fillColor = isHighDemand ? '#f87171' : isOversupplied ? '#34d399' : '#fbbf24';

        // Add spatial heat circle
        const circle = L.circle([zone.lat, zone.lng], {
          color,
          fillColor,
          fillOpacity: 0.35,
          radius: isHighDemand ? 8000 : 6000,
        }).addTo(layerGroup);

        // Custom map marker icon
        const iconHtml = `
          <div style="
            background-color: ${isHighDemand ? '#991b1b' : isOversupplied ? '#065f46' : '#92400e'};
            color: white;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 10px;
            font-weight: 900;
            font-family: monospace;
            border: 2px solid ${color};
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            white-space: nowrap;
          ">
            <span>${isHighDemand ? '🔥' : isOversupplied ? '📦' : '⚖️'}</span>
            <span>${zone.neighborhood} (${zone.demandSupplyRatio}x)</span>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-heatmap-pin',
          html: iconHtml,
          iconSize: [140, 24],
          iconAnchor: [70, 12],
        });

        const marker = L.marker([zone.lat, zone.lng], { icon: customIcon }).addTo(layerGroup);

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; width: 220px; font-size: 12px; color: #0f172a;">
            <div style="font-weight: 900; font-size: 14px; color: #0f172a; margin-bottom: 2px;">
              ${zone.neighborhood}, ${zone.city}
            </div>
            <div style="display: flex; align-items: center; gap: 4px; font-weight: 800; font-size: 11px; margin-bottom: 8px; color: ${color};">
              <span>${isHighDemand ? '🔥 High Demand Deficit' : isOversupplied ? '📦 Oversupplied Inventory' : '⚖️ Balanced Growth'}</span>
            </div>
            <div style="background: #f8fafc; padding: 8px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
              <div><strong>Monthly Searches:</strong> ${zone.monthlySearches.toLocaleString()}</div>
              <div><strong>Active Listings:</strong> ${zone.activeListings}</div>
              <div><strong>Demand Ratio:</strong> <span style="font-weight:900; color:${color};">${zone.demandSupplyRatio}x</span></div>
              <div><strong>Avg Rate:</strong> ₹${zone.avgPriceSqft.toLocaleString()}/sqft</div>
            </div>
            <div style="font-[10px]; font-weight: 700; color: #475569; margin-bottom: 6px;">
              <strong>Strategy:</strong> ${zone.recommendedCampaign}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        circle.bindPopup(popupContent);

        marker.on('click', () => {
          setSelectedZone(zone);
        });
      });
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCityFilter]);

  const handleLaunchCampaign = () => {
    setCampaignLaunched(true);
    setTimeout(() => {
      setCampaignLaunched(false);
      setCampaignModalOpen(false);
    }, 2500);
  };

  return (
    <div className="glass-card p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6 text-[#eaf2ff]">
      {/* Header & Feature Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/15 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-400 border border-red-500/30">
              <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" /> Spatial Heatmap Engine
            </span>
            <span className="text-xs text-[#93a9c7] font-mono">Market Demand vs Supply Density Index</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-red-400" /> Heatmap & Market Demand Insights
          </h2>
          <p className="text-xs text-[#93a9c7] mt-1">
            Analyze search intensity across cities to identify high-demand seller-deficit corridors vs oversupplied neighborhoods to optimize marketing ad spend.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-mono font-bold text-red-400">Demand Radar Live</span>
        </div>
      </div>

      {/* Corridor Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#93a9c7] font-bold text-[11px] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-red-400" /> Filter Region:
          </span>
          {[
            { id: 'ALL', label: 'All Corridors (Global & India)' },
            { id: 'INDIA', label: '🇮🇳 India Metros' },
            { id: 'INTL', label: '🌍 International Markets' },
            { id: 'Mumbai', label: 'Mumbai' },
            { id: 'Bangalore', label: 'Bengaluru' },
            { id: 'Delhi NCR', label: 'Delhi NCR' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedCityFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] cursor-pointer ${
                selectedCityFilter === f.id
                  ? 'bg-red-600 text-white shadow-lg border border-red-400/30'
                  : 'glass-panel text-[#93a9c7] hover:text-white border border-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-[#93a9c7] text-[11px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> High Demand Deficit
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Balanced
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Oversupplied
          </span>
        </div>
      </div>

      {/* Main Grid: Spatial Heatmap Canvas + Corridor Insights Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Spatial Map (7 Cols) */}
        <div className="lg:col-span-7 h-[460px] relative rounded-2xl overflow-hidden border border-white/15 shadow-inner glass">
          <div ref={mapContainerRef} className="w-full h-full min-h-[460px] z-0" />

          {/* Floating Map Overlay Legend */}
          <div className="absolute top-3 right-3 z-10 bg-[#030a14]/90 backdrop-blur p-3 rounded-xl border border-white/15 text-[11px] space-y-1">
            <div className="font-extrabold text-white flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-red-400" /> Spatial Search Intensity
            </div>
            <div className="text-[#93a9c7] text-[10px]">
              Showing search volume vs available listings count
            </div>
          </div>
        </div>

        {/* Right Column: Demand & Supply Corridor Table (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          <div className="glass-panel p-4 rounded-2xl border border-white/15 space-y-3">
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-red-400" /> High-Demand Corridors Index
              </h3>
              <span className="text-[10px] font-mono text-[#93a9c7]">{filteredZones.length} Zones Tracked</span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {filteredZones.map((zone) => {
                const isHighDemand = zone.status === 'HIGH_DEMAND';
                const isOversupplied = zone.status === 'OVERSUPPLIED';
                const isSelected = selectedZone?.id === zone.id;

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#5f86ff]/20 border-red-500/60 shadow-lg'
                        : 'glass-panel hover:bg-white/10 border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-white">{zone.neighborhood}</span>
                          <span className="text-[10px] text-[#93a9c7]">({zone.city})</span>
                        </div>
                        <p className="text-[10px] text-[#93a9c7] mt-0.5">
                          {zone.monthlySearches.toLocaleString()} searches/mo • {zone.activeListings} listings
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-mono font-black px-2 py-0.5 rounded-md border ${
                            isHighDemand
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : isOversupplied
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {isHighDemand ? (
                            <>
                              <ArrowUpRight className="w-3 h-3 text-red-400" /> {zone.demandSupplyRatio}x Ratio
                            </>
                          ) : isOversupplied ? (
                            <>
                              <ArrowDownRight className="w-3 h-3 text-emerald-400" /> {zone.demandSupplyRatio}x Ratio
                            </>
                          ) : (
                            <>⚖️ {zone.demandSupplyRatio}x Ratio</>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Card */}
          {selectedZone ? (
            <div className="glass-panel p-4 rounded-2xl border border-red-500/30 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-extrabold text-white">
                <span className="flex items-center gap-1.5 text-red-400">
                  <Target className="w-4 h-4" /> Selected Zone: {selectedZone.neighborhood} ({selectedZone.city})
                </span>
                <span className="font-mono text-emerald-400">₹{selectedZone.avgPriceSqft.toLocaleString()}/sqft</span>
              </div>
              <p className="text-xs text-[#eaf2ff] font-medium">{selectedZone.recommendedCampaign}</p>
              <button
                onClick={() => setCampaignModalOpen(true)}
                className="w-full py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg border border-red-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Megaphone className="w-4 h-4" /> Launch Optimized Marketing Campaign
              </button>
            </div>
          ) : (
            <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center text-xs text-[#93a9c7]">
              Click any spatial neighborhood hotspot above to inspect demand density & launch marketing campaigns.
            </div>
          )}
        </div>
      </div>

      {/* Marketing Campaign Action Modal */}
      {campaignModalOpen && selectedZone && (
        <div className="fixed inset-0 z-50 bg-[#030a14]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card border border-white/20 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-white animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-red-400" />
                <h3 className="font-black text-base text-white">Launch Targeted Marketing Campaign</h3>
              </div>
              <button
                onClick={() => setCampaignModalOpen(false)}
                className="text-[#93a9c7] hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="glass-panel p-3.5 rounded-2xl border border-white/15 space-y-1">
                <span className="text-[10px] text-[#93a9c7] font-bold uppercase tracking-wider">Target Neighborhood</span>
                <div className="text-sm font-bold text-white">
                  {selectedZone.neighborhood}, {selectedZone.city} ({selectedZone.country})
                </div>
                <div className="text-[#93a9c7] font-mono text-[11px] pt-1">
                  Demand Ratio: <span className="font-extrabold text-red-400">{selectedZone.demandSupplyRatio}x</span> • Monthly Searches: <span className="text-white">{selectedZone.monthlySearches.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#eaf2ff]">Recommended Marketing Rationale:</label>
                <p className="p-3 glass-panel rounded-xl border border-white/15 text-[#eaf2ff] font-medium">
                  {selectedZone.marketingAction}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="glass-panel p-3 rounded-xl border border-white/15">
                  <span className="text-[10px] text-[#93a9c7] font-bold block">Est. Ad Impressions</span>
                  <span className="text-base font-black text-[#5f86ff] mt-0.5 block">145,000+</span>
                </div>

                <div className="glass-panel p-3 rounded-xl border border-white/15">
                  <span className="text-[10px] text-[#93a9c7] font-bold block">Est. Seller Acquisitions</span>
                  <span className="text-base font-black text-emerald-400 mt-0.5 block">24 to 36 Listings</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/15 pt-4">
              <button
                onClick={() => setCampaignModalOpen(false)}
                className="px-4 py-2 glass hover:bg-white/10 text-[#eaf2ff] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunchCampaign}
                disabled={campaignLaunched}
                className="px-5 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg border border-red-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {campaignLaunched ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300 animate-bounce" /> Campaign Activated!
                  </>
                ) : (
                  <>
                    <Megaphone className="w-4 h-4" /> Activate Campaign Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
