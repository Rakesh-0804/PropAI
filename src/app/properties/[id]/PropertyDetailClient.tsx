'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VirtualTourViewer from '@/components/VirtualTourViewer';
import EmiCalculator from '@/components/EmiCalculator';
import ScheduleVisitModal from '@/components/ScheduleVisitModal';
import SinglePropertyMap from '@/components/SinglePropertyMap';
import PropertyCard from '@/components/PropertyCard';
import FloorPlan3DViewer from '@/components/FloorPlan3DViewer';
import UnderwritingCalculator from '@/components/UnderwritingCalculator';
import AIMatchScoreCard from '@/components/AIMatchScoreCard';
import AINeighborhoodCard from '@/components/AINeighborhoodCard';
import { Property, NearbyPlace, formatINR } from '@/types';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Calendar,
  MessageSquare,
  CheckCircle2,
  School,
  Hospital,
  Train,
  ShoppingBag,
  Trees,
  DollarSign,
} from 'lucide-react';

interface PropertyDetailClientProps {
  property: Property;
  priceEst: any;
  matchScore: number;
  recommendations: Property[];
  nearbyPlaces: NearbyPlace[];
}

export default function PropertyDetailClient({
  property,
  priceEst,
  matchScore,
  recommendations,
  nearbyPlaces,
}: PropertyDetailClientProps) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [mediaTab, setMediaTab] = useState<'photos' | '360tour' | '3dfloorplan'>('photos');
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySent, setEnquirySent] = useState(false);

  const isInternational = ['United States', 'USA', 'United Kingdom', 'UK', 'UAE', 'Singapore', 'Japan', 'France', 'Australia', 'Canada', 'Indonesia', 'Switzerland', 'Spain'].some(
    c => property.state?.toLowerCase().includes(c.toLowerCase()) || property.city?.toLowerCase().includes(c.toLowerCase())
  );

  const primaryImage =
    property.media?.[activeMediaIndex]?.mediaUrl ||
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';

  const tourMedia = property.media?.find((m) => m.type === 'tour360');

  const [enquiryError, setEnquiryError] = useState('');
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);

  const handleSendEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryError('');
    setSubmittingEnquiry(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          message: enquiryMessage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setEnquirySent(true);
      } else {
        setEnquiryError(data.error || 'Failed to send enquiry. Please sign in.');
      }
    } catch (err) {
      setEnquiryError('Network error. Please try again.');
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const getNearbyIcon = (type: string) => {
    switch (type) {
      case 'school':
        return <School className="w-4 h-4 text-[#5f86ff]" />;
      case 'hospital':
        return <Hospital className="w-4 h-4 text-rose-400" />;
      case 'transit':
        return <Train className="w-4 h-4 text-purple-400" />;
      case 'shopping':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'park':
        return <Trees className="w-4 h-4 text-emerald-400" />;
      default:
        return <MapPin className="w-4 h-4 text-[#93a9c7]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-[#eaf2ff]">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {isInternational && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                🌍 International Property ({property.state})
              </span>
            )}
            {property.verifiedStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Listing
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 360° Virtual Tour Enabled
            </span>
            <span className="chip text-xs font-bold capitalize">
              For {property.type} • {property.propertyType}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#93a9c7]">
            <MapPin className="w-4 h-4 text-[#5f86ff] shrink-0" />
            <span>
              {property.address}, {property.city}, {property.state} {property.zip}
            </span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="space-y-2 text-left md:text-right shrink-0">
          <div className="text-3xl sm:text-4xl font-black text-[#5f86ff]">
            {formatINR(property.price)}
            {property.type === 'rent' && <span className="text-xs font-normal text-[#93a9c7]">/month</span>}
          </div>
          <div className="text-xs text-[#93a9c7] font-medium">
            Est. {formatINR(Math.round(property.price / property.sizeSqft))} / sqft
          </div>
        </div>
      </div>

      {/* Main Hero Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          {/* View Mode Navigation Ribbon */}
          <div className="glass p-1.5 rounded-2xl border border-white/15 flex items-center justify-between text-xs font-extrabold text-white shadow-xl">
            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setMediaTab('photos')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  mediaTab === 'photos'
                    ? 'bg-[#5f86ff] text-white shadow-md'
                    : 'text-[#93a9c7] hover:text-white'
                }`}
              >
                📸 Photo Gallery ({property.media?.length || 1})
              </button>
              <button
                onClick={() => setMediaTab('360tour')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  mediaTab === '360tour'
                    ? 'bg-[#5f86ff] text-white shadow-md'
                    : 'text-[#93a9c7] hover:text-white'
                }`}
              >
                🌐 360° Virtual Tour
              </button>
              <button
                onClick={() => setMediaTab('3dfloorplan')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  mediaTab === '3dfloorplan'
                    ? 'bg-[#5f86ff] text-white shadow-md'
                    : 'text-[#93a9c7] hover:text-white'
                }`}
              >
                🧊 Interactive 3D Architectural Visualizer
              </button>
            </div>
          </div>

          {/* Render Active Top Media View */}
          {mediaTab === 'photos' && (
            <div className="space-y-3">
              <div className="relative aspect-16/9 rounded-3xl overflow-hidden glass-card border border-white/15 shadow-2xl">
                <Image
                  src={primaryImage}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
              {property.media && property.media.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {property.media.map((med, idx) => (
                    <button
                      key={med.id || idx}
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeMediaIndex === idx ? 'border-[#5f86ff] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={med.mediaUrl}
                        alt={med.caption || `Photo ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {mediaTab === '360tour' && (
            <VirtualTourViewer
              tourUrl={tourMedia?.mediaUrl}
              propertyTitle={property.title}
              isEmbedded={true}
            />
          )}

          {mediaTab === '3dfloorplan' && (
            <FloorPlan3DViewer propertyId={property.id} />
          )}
        </div>

        {/* AI & Quick Action Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Match Score Card */}
          <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4 bg-gradient-to-br from-[#5f86ff]/20 to-indigo-900/30">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5f86ff]">
                <Sparkles className="w-4 h-4 text-amber-400" /> AI Preference Match
              </span>
              <span className="px-2.5 py-1 bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30 text-xs font-mono font-bold rounded-lg">
                Cosine Similarity
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white">{matchScore}%</span>
              <span className="text-xs text-[#93a9c7] font-semibold">Match Confidence Score</span>
            </div>

            <p className="text-xs text-[#93a9c7] leading-relaxed">
              Based on your search filters (Price, {property.bedrooms} Beds, {property.city} location, and amenities).
            </p>
          </div>

          {/* AI Price Estimate Card */}
          <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5 text-purple-400">
                <DollarSign className="w-4 h-4" /> AI Valuation Estimate
              </span>
              <span className="text-emerald-400 font-mono">{priceEst.confidenceScore}% Confidence</span>
            </div>

            <div className="text-xl font-black text-white">
              {formatINR(priceEst.estimatedMin)} – {formatINR(priceEst.estimatedMax)}
            </div>

            <p className="text-xs text-[#93a9c7]">
              Calculated using city base rate ({formatINR(priceEst.factors.baseRatePerSqft)}/sqft), bedroom bonuses, and amenities.
            </p>
          </div>

          {/* 360 Tour Trigger */}
          {tourMedia && (
            <VirtualTourViewer tourUrl={tourMedia.mediaUrl} propertyTitle={property.title} />
          )}

          {/* Schedule Visit Button */}
          <button
            onClick={() => setIsVisitModalOpen(true)}
            className="w-full btn-primary py-3.5 text-sm font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" /> Book In-Person Site Visit
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 space-y-8">
          {/* Property Specs Bar */}
          <div className="glass-card p-6 border border-white/15 shadow-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <Bed className="w-5 h-5 text-[#5f86ff] mx-auto" />
              <span className="text-lg font-bold text-white block">{property.bedrooms} Beds</span>
              <span className="text-[10px] text-[#93a9c7] uppercase font-semibold">Bedrooms</span>
            </div>
            <div className="space-y-1">
              <Bath className="w-5 h-5 text-[#5f86ff] mx-auto" />
              <span className="text-lg font-bold text-white block">{property.bathrooms} Baths</span>
              <span className="text-[10px] text-[#93a9c7] uppercase font-semibold">Bathrooms</span>
            </div>
            <div className="space-y-1">
              <Maximize2 className="w-5 h-5 text-[#5f86ff] mx-auto" />
              <span className="text-lg font-bold text-white block">{property.sizeSqft} sqft</span>
              <span className="text-[10px] text-[#93a9c7] uppercase font-semibold">Living Area</span>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
              <span className="text-lg font-bold text-white block capitalize">{property.verifiedStatus}</span>
              <span className="text-[10px] text-[#93a9c7] uppercase font-semibold">Status Gate</span>
            </div>
          </div>

          {/* Description */}
          <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-3">
            <h3 className="font-bold text-white text-lg">Property Overview</h3>
            <p className="text-sm text-[#93a9c7] leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {/* AI Buyer Compatibility Match Card */}
          <AIMatchScoreCard property={property} />

          {/* AI Neighborhood & Livability Index */}
          <AINeighborhoodCard city={property.city} address={property.address} />

          {/* Amenities Grid */}
          <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-lg">Amenities & Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 p-2.5 rounded-xl glass-panel text-xs font-semibold text-[#eaf2ff]">
                  <CheckCircle2 className="w-4 h-4 text-[#5f86ff] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Property Map Widget */}
          <SinglePropertyMap property={property} />

          {/* Property Valuation & Automated Underwriting Service */}
          <UnderwritingCalculator propertyId={property.id} defaultPrice={property.price} />

          {/* Nearby Places Section */}
          <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#5f86ff]" /> Nearby Places & Landmarks
            </h3>
            <div className="divide-y divide-white/10">
              {nearbyPlaces.map((place) => (
                <div key={place.name} className="py-3 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5 font-medium text-[#eaf2ff]">
                    {getNearbyIcon(place.type)}
                    <span>{place.name}</span>
                  </div>
                  <span className="font-bold text-[#93a9c7] glass px-2.5 py-1 rounded-md border border-white/10">
                    {place.distanceKm} km
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* EMI Calculator */}
          <EmiCalculator propertyPrice={property.price} />
        </div>

        {/* Right 4 Cols: Contact Form */}
        <div className="lg:col-span-4 space-y-6">
          {/* Owner/Agent Card */}
          <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-white/15 pb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-white/20 relative shrink-0">
                <Image
                  src={property.owner?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'}
                  alt={property.owner?.name || 'Agent'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{property.owner?.name || 'Sarah Jenkins'}</h4>
                <p className="text-xs text-[#93a9c7] capitalize">{property.owner?.role || 'Property Owner'} • Verified</p>
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="grid grid-cols-3 gap-2 pb-2">
              <a
                href={`tel:${property.owner?.phone || '+919876543210'}`}
                className="py-2 px-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors text-center"
              >
                📞 Call Agent
              </a>
              <a
                href={`https://wa.me/${(property.owner?.phone || '919876543210').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors text-center"
              >
                💬 WhatsApp
              </a>
              <a
                href={`mailto:${property.owner?.email || 'agent@example.com'}?subject=Inquiry on ${encodeURIComponent(property.title)}`}
                className="py-2 px-2 bg-[#5f86ff]/20 hover:bg-[#5f86ff]/30 text-[#5f86ff] border border-[#5f86ff]/30 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors text-center"
              >
                ✉️ Email
              </a>
            </div>

            {/* Enquiry Form */}
            {enquirySent ? (
              <div className="p-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold">Message Sent Successfully!</p>
                <p>The seller/agent will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSendEnquiry} className="space-y-3 text-xs font-semibold text-[#93a9c7]">
                {enquiryError && (
                  <div className="p-3 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold">
                    {enquiryError}
                  </div>
                )}
                <div>
                  <label className="block mb-1 text-[#93a9c7]">Enquiry Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Hi, I am interested in this property and would like to get more details..."
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    className="w-full glass-input text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingEnquiry}
                  className="w-full btn-primary py-3 text-sm font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" /> {submittingEnquiry ? 'Sending...' : 'Send Direct Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* AI Recommended Similar Properties */}
      {recommendations.length > 0 && (
        <div className="pt-8 border-t border-white/15 space-y-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <Sparkles className="w-5 h-5 text-amber-400" />
            AI Recommended Similar Listings
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <PropertyCard key={rec.id} property={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Visit Schedule Modal */}
      <ScheduleVisitModal
        propertyId={property.id}
        propertyTitle={property.title}
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
      />
    </div>
  );
}
