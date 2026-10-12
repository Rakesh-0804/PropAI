'use client';

import React, { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      const all: Property[] = data.properties || [];

      const wishlistIds: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setProperties(all.filter(p => wishlistIds.includes(p.id)));
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-[#eaf2ff]">
      <div>
        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-400" /> Saved Favorites
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          My Wishlist ({properties.length})
        </h1>
        <p className="text-xs text-[#93a9c7] mt-1">
          Your bookmarked properties for quick access and tracking.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#93a9c7] font-semibold text-sm">
          Loading your saved wishlist...
        </div>
      ) : properties.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/15 shadow-2xl space-y-3">
          <Heart className="w-12 h-12 text-[#93a9c7] mx-auto opacity-60" />
          <h3 className="text-base font-bold text-white">Your wishlist is currently empty</h3>
          <p className="text-xs text-[#93a9c7]">
            Click the heart icon on any property card to save it here.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#5f86ff] hover:bg-[#4a72ee] text-white font-bold rounded-xl text-xs shadow-lg shadow-[#5f86ff]/20 transition-all"
          >
            Explore Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
}
