'use client';

import React from 'react';
import LeafletMap from './LeafletMap';
import { Property } from '@/types';
import { MapPin } from 'lucide-react';

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string;
  onSelectProperty?: (property: Property) => void;
}

export default function PropertyMap({ properties, selectedPropertyId, onSelectProperty }: PropertyMapProps) {
  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-gray-800 flex flex-col">
      {/* Header Overlay */}
      <div className="z-10 bg-slate-800/90 backdrop-blur px-4 py-2.5 border-b border-slate-700 flex justify-between items-center text-white">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <MapPin className="w-4 h-4 text-brand-500" />
          <span>Interactive Location Map ({properties.length} Properties)</span>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-mono">
          OpenStreetMap CDN
        </span>
      </div>

      {/* Leaflet Map Engine */}
      <div className="flex-1 w-full h-full relative">
        <LeafletMap
          properties={properties}
          selectedPropertyId={selectedPropertyId}
          onSelectProperty={onSelectProperty}
        />
      </div>
    </div>
  );
}
