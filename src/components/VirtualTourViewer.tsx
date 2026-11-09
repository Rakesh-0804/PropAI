'use client';

import React, { useState, useMemo } from 'react';
import { RotateCcw, Sparkles, Maximize2, X, Compass, Layers } from 'lucide-react';
import { getDistinctTour360Url, DISTINCT_360_PANORAMAS, buildPannellumUrl } from '@/lib/panoramas';

interface VirtualTourViewerProps {
  tourUrl?: string;
  propertyTitle: string;
  propertyType?: string;
  isEmbedded?: boolean;
}

export default function VirtualTourViewer({
  tourUrl,
  propertyTitle,
  propertyType,
  isEmbedded = false,
}: VirtualTourViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | null>(null);

  // Compute a deterministic primary 360 URL if not provided or if pointing to the generic old default
  const primaryTourUrl = useMemo(() => {
    if (tourUrl && !tourUrl.includes('alma.jpg')) {
      return tourUrl;
    }
    return getDistinctTour360Url(propertyTitle, propertyType, propertyTitle);
  }, [tourUrl, propertyTitle, propertyType]);

  // Compute 3 complementary alternate vantage scenes for this property
  const scenePicks = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < (propertyTitle || '').length; i++) {
      hash = (hash << 5) - hash + propertyTitle.charCodeAt(i);
      hash |= 0;
    }
    const baseIdx = Math.abs(hash) % DISTINCT_360_PANORAMAS.length;
    return [
      DISTINCT_360_PANORAMAS[baseIdx],
      DISTINCT_360_PANORAMAS[(baseIdx + 3) % DISTINCT_360_PANORAMAS.length],
      DISTINCT_360_PANORAMAS[(baseIdx + 7) % DISTINCT_360_PANORAMAS.length],
    ];
  }, [propertyTitle]);

  const activeTourUrl = useMemo(() => {
    if (selectedSceneIndex !== null && scenePicks[selectedSceneIndex]) {
      const scene = scenePicks[selectedSceneIndex];
      return buildPannellumUrl(scene.imageUrl, {
        title: `${propertyTitle} — ${scene.name}`,
        yaw: scene.defaultYaw,
        pitch: scene.defaultPitch,
        autoRotate: -1,
      });
    }
    return primaryTourUrl;
  }, [selectedSceneIndex, scenePicks, propertyTitle, primaryTourUrl]);

  if (isEmbedded) {
    return (
      <div className="relative w-full aspect-16/9 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-white text-xs font-bold shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>360° Interactive Panorama Active</span>
          </div>
        </div>

        {/* Multi-angle / Room switcher ribbon */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-[10px] text-[#93a9c7] font-bold px-1.5 hidden sm:inline">Vantage:</span>
          {scenePicks.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => setSelectedSceneIndex(idx)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                (selectedSceneIndex === idx || (selectedSceneIndex === null && idx === 0))
                  ? 'bg-[#5f86ff] text-white shadow'
                  : 'text-[#93a9c7] hover:text-white hover:bg-white/10'
              }`}
              title={scene.name}
            >
              {idx === 0 ? 'Living / Main' : idx === 1 ? 'Balcony / Vista' : 'Master Suite'}
            </button>
          ))}
        </div>

        <iframe
          key={activeTourUrl}
          src={activeTourUrl}
          className="w-full h-full border-0 rounded-3xl"
          allowFullScreen
          title={`360 Tour for ${propertyTitle}`}
        />

        {/* Bottom Navigation */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 font-medium text-[11px] sm:text-xs">
            <RotateCcw className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            Click & drag inside viewport to rotate 360° · Scroll to zoom
          </span>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-md"
          >
            <Maximize2 className="w-3.5 h-3.5" /> Fullscreen 360°
          </button>
        </div>

        {/* Fullscreen Modal View */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-6xl flex items-center justify-between py-3 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base line-clamp-1">360° Virtual Tour — {propertyTitle}</h3>
              </div>
              <div className="flex items-center gap-2">
                {scenePicks.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedSceneIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      (selectedSceneIndex === idx || (selectedSceneIndex === null && idx === 0))
                        ? 'bg-[#5f86ff] text-white shadow'
                        : 'bg-white/10 text-[#93a9c7] hover:text-white'
                    }`}
                  >
                    {idx === 0 ? 'Living / Main' : idx === 1 ? 'Balcony / Vista' : 'Master Suite'}
                  </button>
                ))}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="relative w-full max-w-6xl aspect-16/9 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <iframe
                key={activeTourUrl}
                src={activeTourUrl}
                className="w-full h-full border-0"
                allowFullScreen
                title={`Fullscreen 360 Tour for ${propertyTitle}`}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/25"
      >
        <Compass className="w-4 h-4 animate-spin text-blue-200" style={{ animationDuration: '6s' }} />
        <span>360° Virtual Tour</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-6xl flex items-center justify-between py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base line-clamp-1">360° Virtual Tour — {propertyTitle}</h3>
            </div>
            <div className="flex items-center gap-2">
              {scenePicks.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => setSelectedSceneIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    (selectedSceneIndex === idx || (selectedSceneIndex === null && idx === 0))
                      ? 'bg-[#5f86ff] text-white shadow'
                      : 'bg-white/10 text-[#93a9c7] hover:text-white'
                  }`}
                >
                  {idx === 0 ? 'Living / Main' : idx === 1 ? 'Balcony / Vista' : 'Master Suite'}
                </button>
              ))}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="relative w-full max-w-6xl aspect-16/9 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <iframe
              key={activeTourUrl}
              src={activeTourUrl}
              className="w-full h-full border-0"
              allowFullScreen
              title={`360 Tour for ${propertyTitle}`}
            />
          </div>
        </div>
      )}
    </>
  );
}
