'use client';

import React, { useState } from 'react';
import { Eye, X, RotateCcw, Compass, Sparkles, Maximize2 } from 'lucide-react';

interface VirtualTourViewerProps {
  tourUrl?: string;
  propertyTitle: string;
  isEmbedded?: boolean;
}

export default function VirtualTourViewer({ tourUrl, propertyTitle, isEmbedded = false }: VirtualTourViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTourUrl = tourUrl || 'https://cdn.pannellum.org/2.5/pannellum.htm#panorama=https://pannellum.org/images/alma.jpg';

  if (isEmbedded) {
    return (
      <div className="relative w-full aspect-16/9 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-white text-xs font-bold shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>360° Interactive Panorama Active</span>
        </div>

        <iframe
          src={defaultTourUrl}
          className="w-full h-full border-0 rounded-3xl"
          allowFullScreen
          title={`360 Tour for ${propertyTitle}`}
        />

        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 font-medium text-[11px] sm:text-xs">
            <RotateCcw className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Click & drag inside the viewport to explore 360° views.
          </span>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5" /> Fullscreen 360°
          </button>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-6xl flex items-center justify-between py-3 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base line-clamp-1">360° Virtual Tour — {propertyTitle}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative w-full max-w-6xl aspect-16/9 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <iframe
                src={defaultTourUrl}
                className="w-full h-full border-0"
                allowFullScreen
                title={`360 Tour for ${propertyTitle}`}
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
        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
      >
        <Compass className="w-5 h-5 animate-spin-slow" />
        <span>Launch 360° Virtual Tour</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-5xl flex items-center justify-between py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base line-clamp-1">360° Virtual Tour — {propertyTitle}</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative w-full max-w-5xl aspect-16/9 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <iframe
              src={defaultTourUrl}
              className="w-full h-full border-0"
              allowFullScreen
              title={`360 Tour for ${propertyTitle}`}
            />
          </div>

          <p className="text-xs text-gray-400 mt-3 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Click & drag inside the viewer to explore 360° interactive view.
          </p>
        </div>
      )}
    </>
  );
}
