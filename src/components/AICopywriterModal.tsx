'use client';

import React, { useState } from 'react';
import { Sparkles, X, Check, Copy, RefreshCw, Wand2, ShieldCheck } from 'lucide-react';

interface AICopywriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    title: string;
    city: string;
    propertyType: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    sizeSqft: number;
    amenities: string[];
  };
  onApplyCopy: (generatedTitle: string, generatedDesc: string) => void;
}

export default function AICopywriterModal({
  isOpen,
  onClose,
  initialData,
  onApplyCopy
}: AICopywriterModalProps) {
  const [tone, setTone] = useState<'luxury' | 'modern' | 'family' | 'investor'>('luxury');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<{ title: string; description: string; highlights: string[] } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/copywrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...initialData, tone })
      });
      const data = await res.json();
      if (res.ok) {
        setGenerated(data);
      }
    } catch (err) {
      console.error('AI Copywrite generation error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 w-full max-w-2xl shadow-2xl p-6 space-y-6 font-sans animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg border border-purple-400/30">
              <Wand2 className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                AI Listing Description Generator
              </h3>
              <p className="text-xs text-slate-400">
                Generate high-converting property descriptions using AGY Gemini AI models.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tone Selector */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
            Select Marketing Tone & Target Buyer Audience:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'luxury', label: '💎 Ultra-Luxury', desc: 'Opulent, high-end' },
              { id: 'modern', label: '⚡ Modern Smart', desc: 'Architectural & tech' },
              { id: 'family', label: '🏡 Family Estate', desc: 'Comfort & schools' },
              { id: 'investor', label: '📈 High-Yield Investor', desc: 'ROI & cash-flow focus' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTone(t.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  tone === t.id
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-extrabold text-xs">{t.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-extrabold text-xs text-white rounded-2xl shadow-xl border border-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing AI Copywriter Content...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" /> Generate Professional AI Copy
            </>
          )}
        </button>

        {/* Generated Result Output */}
        {generated && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4 animate-in fade-in duration-300 text-xs">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-purple-400 tracking-wider block">
                Generated Catchy Title:
              </span>
              <h4 className="font-extrabold text-sm text-white mt-1 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                {generated.title}
              </h4>
            </div>

            <div>
              <span className="text-[10px] uppercase font-extrabold text-purple-400 tracking-wider block">
                Generated Comprehensive Description:
              </span>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-slate-200 leading-relaxed max-h-48 overflow-y-auto mt-1">
                {generated.description}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-extrabold text-purple-400 tracking-wider block">
                Key AI Marketing Highlights:
              </span>
              <ul className="space-y-1.5 mt-1">
                {generated.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  onApplyCopy(generated.title, generated.description);
                  onClose();
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-extrabold text-white text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Apply AI Copy to Listing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
