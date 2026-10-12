'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Bed, Bath, Maximize2, ShieldCheck, Sparkles, Scale, Eye } from 'lucide-react';
import { Property, formatINR } from '@/types';

interface PropertyCardProps {
  property: Property;
  onCompareToggle?: (propertyId: string, isSelected: boolean) => void;
  isCompared?: boolean;
}

export default function PropertyCard({ property, onCompareToggle, isCompared = false }: PropertyCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(property.id ? wishlist.includes(property.id) : false);
  }, [property.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let wishlist: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.includes(property.id)) {
      wishlist = wishlist.filter(id => id !== property.id);
      setIsWishlisted(false);
    } else {
      wishlist.push(property.id);
      setIsWishlisted(true);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('storage'));
  };

  const primaryImage = property.media && property.media.length > 0
    ? property.media.find(m => m.type === 'image')?.mediaUrl || property.media[0].mediaUrl
    : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

  const formattedPrice = formatINR(property.price);

  const isInternational = ['United States', 'USA', 'United Kingdom', 'UK', 'UAE', 'Singapore', 'Japan', 'France', 'Australia', 'Canada', 'Indonesia', 'Switzerland', 'Spain'].some(
    c => property.state?.toLowerCase().includes(c.toLowerCase()) || property.city?.toLowerCase().includes(c.toLowerCase())
  );

  return (
    <div className="group glass-card overflow-hidden border border-white/15 hover:border-white/30 shadow-2xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900/60">
        <Image
          src={primaryImage}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          {isInternational && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-white/20">
              🌍 Intl
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-slate-950/80 backdrop-blur-md text-white shadow-md border border-white/20">
            🌐 360°
          </span>
          {property.verifiedStatus === 'verified' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/90 backdrop-blur-md text-white shadow-xs">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          )}
          {property.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/90 backdrop-blur-md text-white shadow-xs">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-red-400 backdrop-blur-md border border-white/20 transition-colors z-10"
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-xl font-black text-lg shadow-lg z-10">
          {formattedPrice}
          {property.type === 'rent' && <span className="text-xs font-normal text-slate-300">/mo</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-[#93a9c7] uppercase tracking-wider mb-1">
            <span className="text-[#5f86ff] font-extrabold capitalize">{property.propertyType.replace('_', ' ')}</span>
            <span>{property.city}, {property.state}</span>
          </div>

          <Link href={`/properties/${property.id}`} prefetch={true} className="block group/title">
            <h3 className="font-extrabold text-[#eaf2ff] line-clamp-1 group-hover/title:text-[#5f86ff] transition-colors text-base">
              {property.title}
            </h3>
          </Link>
          <p className="text-xs text-[#93a9c7] line-clamp-1 mt-1">{property.address}</p>
        </div>

        {/* Property Specs */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-xs font-medium text-[#93a9c7]">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-[#5f86ff]" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-[#5f86ff]" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-[#5f86ff]" />
            <span>{property.sizeSqft} sqft</span>
          </div>
        </div>

        {/* AI Match Score & Action Row */}
        <div className="flex items-center justify-between pt-1">
          {property.matchScore ? (
            <div className="flex items-center gap-1.5 bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30 px-2.5 py-1 rounded-lg text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{property.matchScore}% Match</span>
            </div>
          ) : (
            <div className="text-xs text-[#93a9c7] font-medium">Verified Listing</div>
          )}

          <div className="flex items-center gap-2">
            {onCompareToggle && (
              <label className="flex items-center gap-1 text-xs text-[#93a9c7] cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={isCompared}
                  onChange={(e) => onCompareToggle(property.id, e.target.checked)}
                  className="rounded border-white/30 bg-white/10 text-[#5f86ff] focus:ring-[#5f86ff]"
                />
                <Scale className="w-3.5 h-3.5" />
              </label>
            )}

            <Link
              href={`/properties/${property.id}`}
              prefetch={true}
              className="btn-primary py-1.5 px-3 text-xs font-bold gap-1 shadow-md"
            >
              <Eye className="w-3.5 h-3.5" /> View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
