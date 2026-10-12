'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Sparkles, ShieldCheck, MapPin, Calculator } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/login') {
    return null;
  }

  return (
    <footer className="bg-[#040d1a]/80 backdrop-blur-xl text-[#93a9c7] py-12 border-t border-white/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <div className="p-2 bg-[#5f86ff] rounded-xl shadow-lg shadow-[#5f86ff]/30">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#eaf2ff] to-[#93a9c7]">
                PropAI Estate
              </span>
            </div>
            <p className="text-sm text-[#93a9c7] leading-relaxed">
              AI-Powered Real Estate Platform connecting buyers, sellers, agents, and admins with automated valuation, match scores, 360° virtual tours, and fake listing protection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#eaf2ff] font-semibold text-sm mb-4 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties" className="hover:text-[#5f86ff] transition-colors">Property Search</Link></li>
              <li><Link href="/compare" className="hover:text-[#5f86ff] transition-colors">Comparison Tool</Link></li>
              <li><Link href="/properties?verifiedOnly=true" className="hover:text-[#5f86ff] transition-colors">Verified Listings</Link></li>
              <li><Link href="/wishlist" className="hover:text-[#5f86ff] transition-colors">Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="text-[#eaf2ff] font-semibold text-sm mb-4 uppercase tracking-wider">AI Features</h4>
            <ul className="space-y-2 text-sm text-[#93a9c7]">
              <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> Smart Price Estimation</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Duplicate & Fraud Detection</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sky-400" /> Nearby Places Analysis</li>
              <li className="flex items-center gap-2"><Calculator className="w-4 h-4 text-purple-400" /> EMI & ROI Calculator</li>
            </ul>
          </div>

          {/* Contact / Platform */}
          <div>
            <h4 className="text-[#eaf2ff] font-semibold text-sm mb-4 uppercase tracking-wider">System Info</h4>
            <p className="text-xs text-[#93a9c7] leading-relaxed mb-3">
              Built with Next.js 14, Tailwind CSS, PostgreSQL, Prisma ORM, and integrated Python/Node AI Engine.
            </p>
            <div className="inline-block px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
              ● Systems Operational
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-[#93a9c7] gap-4">
          <p>© 2026 PropAI Estate Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
