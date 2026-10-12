'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Heart, Sparkles, LogOut, ShieldCheck, Building2, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    fetchWishlistCount();
  }, [user]);

  const fetchWishlistCount = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlistCount(data.wishlist?.length || 0);
      }
    } catch (err) {
      setWishlistCount(0);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  // Hide top Navbar completely on auth pages (/login, /signup) as requested
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  // Role-based dashboard navigation flags:
  // - Admin users get access to Buyer, Seller, and Admin dashboards
  // - Buyer users see Buyer dashboard
  // - Seller/Agent users see Seller dashboard
  const showBuyer = user && (user.role === 'buyer' || user.role === 'admin');
  const showSeller = user && (user.role === 'seller' || user.role === 'agent' || user.role === 'admin');
  const showAdmin = user && user.role === 'admin';

  return (
    <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <div className="glass px-5 py-3 border border-white/15 shadow-2xl flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">
            Prop<span className="text-[#5f86ff]">AI</span> Estate
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs font-bold text-[#93a9c7]">
          <Link
            href="/properties"
            className={`px-3 py-1.5 rounded-xl transition-all ${
              isActive('/properties') && !pathname.includes('verifiedOnly')
                ? 'text-white bg-white/15 border border-white/20 shadow-xs'
                : 'hover:text-white hover:bg-white/10'
            }`}
          >
            Browse
          </Link>

          <Link
            href="/compare"
            className={`px-3 py-1.5 rounded-xl transition-all ${
              isActive('/compare')
                ? 'text-white bg-white/15 border border-white/20 shadow-xs'
                : 'hover:text-white hover:bg-white/10'
            }`}
          >
            Compare
          </Link>

          <Link
            href="/properties?verifiedOnly=true"
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              pathname.includes('verifiedOnly')
                ? 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/30'
                : 'hover:text-emerald-300 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Verified
          </Link>

          {showBuyer && (
            <Link
              href="/dashboard/buyer"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isActive('/dashboard/buyer')
                  ? 'text-white bg-white/15 border border-white/20 shadow-xs'
                  : 'hover:text-white hover:bg-white/10'
              }`}
            >
              Buyer
            </Link>
          )}

          {showSeller && (
            <Link
              href="/dashboard/seller"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isActive('/dashboard/seller')
                  ? 'text-white bg-white/15 border border-white/20 shadow-xs'
                  : 'hover:text-white hover:bg-white/10'
              }`}
            >
              Seller
            </Link>
          )}

          {showAdmin && (
            <Link
              href="/dashboard/admin"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isActive('/dashboard/admin')
                  ? 'text-white bg-white/15 border border-white/20 shadow-xs'
                  : 'hover:text-white hover:bg-white/10'
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* User Controls & Auth Bar */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="relative p-2 text-[#93a9c7] hover:text-red-400 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User Status / Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-white/15">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden relative bg-slate-800 border border-white/20">
                  <Image
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="hidden lg:block text-xs font-extrabold text-[#eaf2ff]">{user.name.split(' ')[0]}</span>
              </div>

              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-xs font-bold">
              <Link
                href="/login"
                className="text-[#93a9c7] hover:text-white transition-colors"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="btn-primary py-2 px-4 text-xs font-extrabold shadow-md"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
