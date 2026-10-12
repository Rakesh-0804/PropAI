'use client';

import React, { useEffect, useRef } from 'react';
import { Property } from '@/types';

interface LeafletMapProps {
  properties: Property[];
  selectedPropertyId?: string;
  onSelectProperty?: (property: Property) => void;
  center?: [number, number];
  zoom?: number;
}

export default function LeafletMap({
  properties,
  selectedPropertyId,
  onSelectProperty,
  center = [37.7749, -122.4194],
  zoom = 11,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});

  useEffect(() => {
    // Inject Leaflet CSS dynamically if not present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    let isMounted = true;

    // Dynamically import Leaflet client-side
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default marker icon URLs
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Calculate center from properties if available
      let mapCenter = center;
      if (properties && properties.length > 0) {
        const avgLat = properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length;
        const avgLng = properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length;
        if (!isNaN(avgLat) && !isNaN(avgLng)) {
          mapCenter = [avgLat, avgLng];
        }
      }

      // Initialize map instance if not existing
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current).setView(mapCenter, zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      } else {
        mapInstanceRef.current.setView(mapCenter, zoom);
      }

      const map = mapInstanceRef.current;

      // Clear previous markers
      Object.values(markersRef.current).forEach((marker: any) => marker.remove());
      markersRef.current = {};

      // Custom marker icon HTML
      properties.forEach((prop) => {
        const isSelected = prop.id === selectedPropertyId;
        const priceText = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(prop.price);

        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `<div style="
            background-color: ${isSelected ? '#2563eb' : '#1e293b'};
            color: white;
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: bold;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
            border: 2px solid ${isSelected ? '#60a5fa' : '#ffffff'};
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
          ">${priceText}</div>`,
          iconSize: [80, 30],
          iconAnchor: [40, 15],
        });

        const marker = L.marker([prop.latitude, prop.longitude], { icon: customIcon }).addTo(map);

        // Popup content
        const popupContent = `
          <div style="font-family: system-ui, sans-serif; width: 180px;">
            <img src="${prop.media?.[0]?.mediaUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
            <div style="font-weight: bold; font-size: 12px; color: #0f172a; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${prop.title}</div>
            <div style="font-size: 11px; font-weight: bold; color: #2563eb;">${priceText}</div>
            <div style="font-size: 10px; color: #64748b;">${prop.bedrooms} Beds • ${prop.sizeSqft} sqft • ${prop.city}</div>
            <a href="/properties/${prop.id}" style="display: inline-block; margin-top: 6px; font-size: 10px; font-weight: bold; color: white; background: #2563eb; padding: 4px 8px; border-radius: 6px; text-decoration: none;">View Listing →</a>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectProperty) onSelectProperty(prop);
        });

        markersRef.current[prop.id] = marker;
      });
    });

    return () => {
      isMounted = false;
    };
  }, [properties, selectedPropertyId, center, zoom, onSelectProperty]);

  return (
    <div className="w-full h-full min-h-[450px] relative rounded-2xl overflow-hidden shadow-inner border border-gray-200">
      <div ref={mapContainerRef} className="w-full h-full min-h-[450px] z-0" />
    </div>
  );
}
