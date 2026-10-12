'use client';

import React from 'react';
import LeafletMap from './LeafletMap';
import { Property } from '@/types';
import { MapPin, Navigation } from 'lucide-react';

interface SinglePropertyMapProps {
  property: Property;
}

export default function SinglePropertyMap({ property }: SinglePropertyMapProps) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;

  return (
    <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4 text-[#eaf2ff]">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#5f86ff]" /> Exact Property Location
          </h3>
          <p className="text-xs text-[#93a9c7]">{property.address}, {property.city}, {property.state} {property.zip}</p>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5f86ff]/20 text-[#5f86ff] text-xs font-bold hover:bg-[#5f86ff]/30 transition-colors border border-[#5f86ff]/30 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" /> Get Directions
        </a>
      </div>

      <div className="h-[350px] w-full rounded-xl overflow-hidden border border-white/15 glass">
        <LeafletMap
          properties={[property]}
          selectedPropertyId={property.id}
          center={[property.latitude, property.longitude]}
          zoom={14}
        />
      </div>
    </div>
  );
}
