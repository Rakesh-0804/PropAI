import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Sparkles, Search, ShieldCheck, Compass, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/20 text-[#5f86ff] text-xs font-bold shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Next-Gen AI Real Estate Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-[#eaf2ff]">
            Find Your Dream Home with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5f86ff] via-indigo-300 to-sky-300">
              AI Precision & 360° Tours
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#93a9c7] max-w-2xl mx-auto font-normal leading-relaxed">
            Intelligent property matching, real-time price estimation, automated fraud verification, and interactive 360° virtual tours for buyers and sellers.
          </p>

          {/* Quick Search Card */}
          <div className="glass-card p-3 sm:p-4 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 items-center border border-white/20 shadow-2xl">
            <div className="flex-1 w-full flex items-center gap-2 px-4 py-3 glass-input border-0 bg-white/10">
              <Search className="w-5 h-5 text-[#93a9c7] shrink-0" />
              <input
                type="text"
                placeholder="Search city, neighborhood, or address..."
                className="w-full bg-transparent text-sm font-medium text-white placeholder-[#93a9c7] focus:outline-none"
              />
            </div>
            
            <Link
              href="/properties"
              className="w-full sm:w-auto btn-primary py-3 px-6 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shrink-0"
            >
              Explore Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Layered Stats Panel */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-4 text-center">
              <span className="text-3xl font-black text-[#eaf2ff] block">291</span>
              <span className="text-xs text-[#93a9c7] font-semibold">Verified Properties</span>
            </div>
            <div className="glass-panel p-4 text-center">
              <span className="text-3xl font-black text-emerald-400 block">97</span>
              <span className="text-xs text-[#93a9c7] font-semibold">Scams Caught</span>
            </div>
            <div className="glass-panel p-4 text-center">
              <span className="text-3xl font-black text-[#5f86ff] block">360°</span>
              <span className="text-xs text-[#93a9c7] font-semibold">Virtual Tours</span>
            </div>
            <div className="glass-panel p-4 text-center">
              <span className="text-3xl font-black text-amber-400 block">98%</span>
              <span className="text-xs text-[#93a9c7] font-semibold">AI Match Precision</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Platform Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#eaf2ff] tracking-tight">
              Powered by Intelligent Real Estate AI
            </h2>
            <p className="text-sm text-[#93a9c7]">
              Built with dedicated microservices for price estimation, preference matching, and fraud protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 border border-white/15 space-y-4 shadow-xl">
              <div className="p-3 bg-[#5f86ff]/20 text-[#5f86ff] rounded-xl w-fit border border-[#5f86ff]/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-lg">Smart Price Estimator</h3>
              <p className="text-xs text-[#93a9c7] leading-relaxed">
                Regression algorithms analyze square footage, city base rates, bedroom bonuses, and amenities to deliver fair market valuation confidence ranges.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/15 space-y-4 shadow-xl">
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl w-fit border border-purple-500/30">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-lg">360° Virtual Tours</h3>
              <p className="text-xs text-[#93a9c7] leading-relaxed">
                Step inside property interiors remotely with interactive 360° panorama tour viewer integration before scheduling in-person visits.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/15 space-y-4 shadow-xl">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit border border-emerald-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-lg">Admin Verification Gate</h3>
              <p className="text-xs text-[#93a9c7] leading-relaxed">
                Perceptual hashing and text similarity detection flag duplicate or fake listings for admin review, ensuring 100% platform integrity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
