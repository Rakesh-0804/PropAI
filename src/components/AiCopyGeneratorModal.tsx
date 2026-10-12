'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, Wand2 } from 'lucide-react';
import { generateListingCopy, CopyGenInput } from '@/lib/ai/aiCopywriter';

interface AiCopyGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData?: Partial<CopyGenInput>;
}

export default function AiCopyGeneratorModal({
  isOpen,
  onClose,
  defaultData,
}: AiCopyGeneratorModalProps) {
  const [title, setTitle] = useState(defaultData?.title || 'Modern Luxury Villa');
  const [city, setCity] = useState(defaultData?.city || 'Austin');
  const [propertyType, setPropertyType] = useState(defaultData?.propertyType || 'house');
  const [price, setPrice] = useState(defaultData?.price || 750000);
  const [bedrooms, setBedrooms] = useState(defaultData?.bedrooms || 4);
  const [bathrooms, setBathrooms] = useState(defaultData?.bathrooms || 3);
  const [sizeSqft, setSizeSqft] = useState(defaultData?.sizeSqft || 2800);
  const [tone, setTone] = useState<'luxury' | 'modern' | 'family' | 'investor'>('luxury');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = generateListingCopy({
      title,
      city,
      propertyType,
      price: Number(price),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sizeSqft: Number(sizeSqft),
      amenities: ['Swimming Pool', 'Smart Home', 'Private Terrace', 'Gourmet Kitchen'],
      tone,
    });
    setGeneratedText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-950 text-white rounded-3xl w-full max-w-2xl p-6 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">AI Listing Description Generator</h3>
              <span className="text-[10px] text-slate-400 font-mono">High-Converting Real Estate Marketing Copy</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs font-semibold text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Property Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-medium"
              />
            </div>

            <div>
              <label className="block mb-1">City Location</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-medium"
              />
            </div>

            <div>
              <label className="block mb-1">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-medium"
              />
            </div>

            <div>
              <label className="block mb-1">Marketing Narrative Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-blue-400 font-bold"
              >
                <option value="luxury">✨ Luxury & Prestige</option>
                <option value="modern">🏙️ Modern & Architectural</option>
                <option value="family">🏡 Family & Community</option>
                <option value="investor">📈 High-Yield Investor Pitch</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Generate AI Copy
          </button>
        </form>

        {generatedText && (
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Generated Marketing Copy</span>
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Copy'}
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-800">
              {generatedText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
