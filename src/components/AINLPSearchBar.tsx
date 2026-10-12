'use client';

import React, { useState } from 'react';
import { Sparkles, Search, MapPin, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ParsedCriteria {
  city: string;
  propertyType: string;
  bedrooms: string;
  maxPriceFormatted: string;
}

export default function AINLPSearchBar({ onResultsFound }: { onResultsFound?: (properties: any[]) => void }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [parsed, setParsed] = useState<ParsedCriteria | null>(null);

  const samplePrompts = [
    '🔥 1 BHK budget flat under 20 Lakhs',
    '3 BHK sea facing apartment in Mumbai under 3 Crores',
    'Residential plot near IT park in Bangalore under 90 Lakhs',
    'Luxury villa with private pool in Hyderabad under 2.5 Cr',
    'Grade-A commercial office space in Pune'
  ];

  const handleSearch = async (textToSearch?: string) => {
    const query = textToSearch || prompt.trim();
    if (!query || loading) return;

    if (textToSearch) setPrompt(textToSearch);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/nlp-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });
      const data = await res.json();

      if (res.ok && data.properties) {
        setResults(data.properties);
        setParsed(data.parsedCriteria);
        if (onResultsFound) {
          onResultsFound(data.properties);
        }
      }
    } catch (err) {
      console.error('NLP Search error', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    return `₹${(price / 100000).toFixed(2)} Lakhs`;
  };

  return (
    <div className="w-full glass-card p-6 shadow-2xl border border-white/15 space-y-4 font-sans text-[#eaf2ff]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              AI Natural Language Property Finder
            </h3>
            <p className="text-xs text-[#93a9c7]">
              Type naturally like "3 BHK villa in Bangalore under 2 Cr with pool" and AGY AI parses criteria instantly.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30 px-3 py-1 rounded-full self-start sm:self-center shrink-0">
          ⚡ Neural NLP Parser Active
        </span>
      </div>

      {/* Input Search Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-[#93a9c7] absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="e.g. 3 BHK sea view apartment in Mumbai Bandra West under 3.5 Crores..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full glass-input pl-12 pr-4 py-3.5 text-xs sm:text-sm font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full sm:w-auto btn-primary py-3.5 px-6 text-xs font-extrabold shadow-lg shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin mr-1.5" /> AI Parsing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-1.5" /> AI Search
            </>
          )}
        </button>
      </form>

      {/* Sample Suggestion Chips */}
      <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
        <span className="text-[#93a9c7] font-bold text-[11px]">Try AI prompts:</span>
        {samplePrompts.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSearch(s)}
            className="chip hover:chip-active text-[11px] font-medium transition-all text-left flex items-center gap-1.5 cursor-pointer"
          >
            ✨ {s}
          </button>
        ))}
      </div>

      {/* Render AI Parsed Criteria & Results */}
      {parsed && (
        <div className="mt-4 pt-4 border-t border-white/15 space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center gap-2 glass-panel p-3 text-xs">
            <span className="text-[#93a9c7] font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#5f86ff]" /> AI Extracted Filters:
            </span>
            <span className="bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30 px-2.5 py-1 rounded-lg font-bold">
              📍 {parsed.city}
            </span>
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-lg font-bold">
              🏡 {parsed.propertyType}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold">
              🛏️ {parsed.bedrooms}
            </span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold">
              💰 Max: {parsed.maxPriceFormatted}
            </span>
          </div>

          {results && results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.slice(0, 6).map((prop) => (
                <Link
                  key={prop.id}
                  href={`/properties/${prop.id}`}
                  className="group glass-panel overflow-hidden hover:border-[#5f86ff]/50 transition-all hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-36 overflow-hidden bg-slate-900/60">
                      <img
                        src={prop.media?.[0]?.mediaUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-[#5f86ff] border border-white/15 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase">
                        {prop.propertyType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1.5">
                      <h4 className="font-bold text-sm text-white truncate group-hover:text-[#5f86ff] transition-colors">
                        {prop.title}
                      </h4>
                      <p className="text-[#93a9c7] text-xs flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" /> {prop.address}, {prop.city}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#93a9c7] font-mono pt-1">
                        <span>🛏️ {prop.bedrooms} Bed</span>
                        <span>🚿 {prop.bathrooms} Bath</span>
                        <span>📐 {prop.sizeSqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 pt-0 flex items-center justify-between border-t border-white/10 mt-2">
                    <span className="text-base font-extrabold text-[#5f86ff]">
                      {formatPrice(prop.price)}
                    </span>
                    <span className="text-xs text-[#93a9c7] group-hover:text-white font-bold flex items-center gap-1">
                      Inspect <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-6 text-center text-[#93a9c7] text-xs">
              No direct matches found for these exact criteria. Try broadening your budget or location prompt above!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
