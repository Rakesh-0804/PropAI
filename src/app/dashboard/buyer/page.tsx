'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MessageSquare,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Key,
  Layers,
  Sparkles,
  DollarSign,
  Compass,
  MapPin,
  FileCheck2,
  Building2,
  TrendingUp,
  CheckCircle2,
  Heart,
  ExternalLink,
  Clock,
  Banknote,
  Eye,
  Video,
  AlertCircle,
  Percent,
  Award,
  Filter,
  Check,
  Building,
  Lock,
} from 'lucide-react';
import { formatINR } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { calculatePurchasingPower, buildComparisonMatrix } from '@/lib/ai/buyerAnalytics';
import { getNeighborhoodVibe } from '@/lib/ai/neighborhoodIndex';
import { useSearchParams } from 'next/navigation';

function BuyerDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const unauthorizedNotice = searchParams.get('unauthorized');

  const [siteVisits, setSiteVisits] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [wishlistProperties, setWishlistProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Bangalore');

  // Purchasing Power Simulator State (INR)
  const [annualIncome, setAnnualIncome] = useState<number>(2400000);
  const [monthlyDebt, setMonthlyDebt] = useState<number>(35000);
  const [downPaymentSavings, setDownPaymentSavings] = useState<number>(3000000);
  const [creditTier, setCreditTier] = useState<'excellent' | 'good' | 'fair'>('excellent');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [vRes, eRes, pRes] = await Promise.all([
        fetch('/api/visits'),
        fetch('/api/enquiries'),
        fetch('/api/properties'),
      ]);

      const vData = await vRes.json();
      const eData = await eRes.json();
      const pData = await pRes.json();

      setSiteVisits(vData.visits || []);
      setEnquiries(eData.enquiries || []);
      setWishlistProperties(pData.properties?.slice(0, 4) || []);
    } catch (err) {
      console.error('Error loading buyer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const purchasingPower = calculatePurchasingPower({
    annualIncome,
    monthlyDebt,
    downPaymentSavings,
    creditTier,
  });

  const comparisonMatrix = buildComparisonMatrix(wishlistProperties);
  const neighborhoodVibe = getNeighborhoodVibe(selectedCity);

  // Sample Purchase Offers
  const sampleOffers = [
    {
      id: 'off-1',
      title: 'The Sky View Glass Penthouse',
      city: 'Bangalore',
      offeredAmount: 34000000,
      askingPrice: 34500000,
      status: 'Countered',
      sellerCounter: 34250000,
      escrowStatus: '₹5,00,000 Locked in HDFC Escrow',
      date: '2026-09-28',
    },
    {
      id: 'off-2',
      title: 'Oberoi Sky Heights Luxury Suite',
      city: 'Mumbai',
      offeredAmount: 66500000,
      askingPrice: 68000000,
      status: 'Offer Under Review',
      sellerCounter: null,
      escrowStatus: 'Earnest Deposit Ready',
      date: '2026-09-27',
    },
    {
      id: 'off-3',
      title: 'DLF Golf Estate Villa',
      city: 'Delhi NCR',
      offeredAmount: 122000000,
      askingPrice: 125000000,
      status: 'Accepted',
      sellerCounter: 122000000,
      escrowStatus: 'Sale Agreement Executed (Token Paid)',
      date: '2026-09-20',
    },
  ];

  // AI Curated Recommended Properties
  const recommendedProperties = [
    {
      id: 'prop-buyer-1',
      title: 'The Sky View Glass Penthouse',
      city: 'Bangalore',
      location: 'Indiranagar 100ft Road',
      price: 34500000,
      pricePerSqft: 10615,
      sqft: 3250,
      bedrooms: 4,
      bathrooms: 4.5,
      matchScore: 98,
      matchReason: 'Top Match: 10 min to Tech Park, 10-Yr ROI +14.2%, Solar Backup',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      tags: ['RERA Approved', 'Smart Lock Ready', '360° VR Tour', 'Title Verified'],
      reraId: 'PRM/KA/RERA/1251/310/PR/210304/004012',
      builder: 'Sobha Developers Ltd',
    },
    {
      id: 'prop-buyer-2',
      title: 'Oberoi Sky Heights Luxury Suite',
      city: 'Mumbai',
      location: 'Worli Sea Face',
      price: 68000000,
      pricePerSqft: 28333,
      sqft: 2400,
      bedrooms: 3,
      bathrooms: 3,
      matchScore: 95,
      matchReason: 'Unobstructed Arabian Sea View, 8.8% Rental Yield, Zero Fraud Risk',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      tags: ['Sea View', 'Private Elevator', '24/7 Security', 'Verified Owner'],
      reraId: 'P51900001342',
      builder: 'Oberoi Realty',
    },
    {
      id: 'prop-buyer-3',
      title: 'DLF Golf Estate Super Luxury Villa',
      city: 'Delhi NCR',
      location: 'Golf Course Road, Gurgaon',
      price: 125000000,
      pricePerSqft: 22727,
      sqft: 5500,
      bedrooms: 5,
      bathrooms: 6,
      matchScore: 92,
      matchReason: 'Gated Luxury Estate, Championship Golf View, Fully Automated IoT',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      tags: ['Private Pool', 'Golf View', 'EV Chargers', 'Smart Home IoT'],
      reraId: 'GGM/382/114/2020/01',
      builder: 'DLF Limited',
    },
    {
      id: 'prop-buyer-4',
      title: 'Adarsh Palm Retreat Eco Villa',
      city: 'Bangalore',
      location: 'Bellandur - ORR Tech Corridor',
      price: 42000000,
      pricePerSqft: 11052,
      sqft: 3800,
      bedrooms: 4,
      bathrooms: 4,
      matchScore: 96,
      matchReason: '5 min walk to EcoWorld Tech Park, Private Lawn, Zero Commission',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      tags: ['Solar Powered', 'Private Lawn', 'Clubhouse Pass', 'Pre-Approved Loan'],
      reraId: 'PRM/KA/RERA/1251/310/PR/171015/000450',
      builder: 'Adarsh Group',
    },
  ];

  // Pre-approved Mortgage Offers
  const mortgageOffers = [
    {
      bankName: 'HDFC Bank Home Loans',
      logo: '🏦',
      interestRate: '8.50%',
      rateType: 'Repo-Linked (Floating)',
      preApprovedLimit: 25000000,
      processingFee: '₹0 (PropAI Waiver)',
      tenureYears: 20,
      monthlyEmiPerLakh: '₹868',
      status: 'Instant Sanction Ready',
      features: ['Zero Foreclosure Penalty', 'Doorstep Document Pickup', 'Digital Sanction in 5 Mins'],
      recommended: true,
    },
    {
      bankName: 'State Bank of India (SBI)',
      logo: '🏛️',
      interestRate: '8.40%',
      rateType: 'EBLR Linked',
      preApprovedLimit: 30000000,
      processingFee: '0.25% (Max ₹10,000)',
      tenureYears: 30,
      monthlyEmiPerLakh: '₹762',
      status: 'Pre-Approved (CIBIL 780+)',
      features: ['Lowest Rate Guarantee', 'Women Co-applicant Subsidy', 'Max 30-Year Loan Tenure'],
      recommended: false,
    },
    {
      bankName: 'ICICI Bank Home Finance',
      logo: '💳',
      interestRate: '8.65%',
      rateType: 'I-MCLR 1-Year',
      preApprovedLimit: 20000000,
      processingFee: 'Flat ₹4,999',
      tenureYears: 25,
      monthlyEmiPerLakh: '₹815',
      status: 'Express Digital Approval',
      features: ['10-Min Sanction Letter', 'Property Legal Fee Included', 'Flexible Top-up Facility'],
      recommended: false,
    },
  ];

  // Legal Title Due Diligence Reports
  const dueDiligenceReports = [
    {
      id: 'dd-1',
      propertyName: 'The Sky View Glass Penthouse',
      city: 'Bangalore',
      titleStatus: 'Clear & Marketable (30-Yr Search)',
      encumbranceCertificate: 'Nil Encumbrance Verified',
      reraVerification: 'RERA Registered (KA-RERA-2021)',
      taxReceipts: 'Up-to-Date (BBMP Paid)',
      escrowDepositStatus: '₹5,00,000 Locked in HDFC Escrow',
      auditScore: '99/100',
      lawyerSignoff: 'Adv. Suresh K. (Senior High Court Advocate)',
    },
    {
      id: 'dd-2',
      propertyName: 'Oberoi Sky Heights Luxury Suite',
      city: 'Mumbai',
      titleStatus: 'Clear Title (Society NOC Attached)',
      encumbranceCertificate: 'Verified - No Mortgages',
      reraVerification: 'RERA Registered (MHA-RERA)',
      taxReceipts: 'Up-to-Date (BMC Property Tax)',
      escrowDepositStatus: 'Earnest Deposit Ready',
      auditScore: '97/100',
      lawyerSignoff: 'Adv. Meera Merchant (Property Law Specialist)',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#eaf2ff]">
      {unauthorizedNotice && (
        <div className="glass p-4 border border-amber-400/30 text-amber-200 text-xs font-semibold flex items-center justify-between shadow-lg rounded-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              {unauthorizedNotice === 'admin_only'
                ? '🔒 Admin Access Restricted: Your Buyer account has limited privileges. Redirected to Buyer Command Center.'
                : '🔒 Seller Access Restricted: Seller portal requires a Seller account. Redirected to Buyer Command Center.'}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
            Limited Access Mode
          </span>
        </div>
      )}

      {/* Dashboard Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30 tracking-wider">
              PropAI Verified Buyer Platform
            </span>
            <span className="text-xs text-[#93a9c7] font-mono">ID: BUYER-88402</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#eaf2ff] tracking-tight flex items-center gap-3">
            Buyer Command Center
          </h1>
          <p className="text-xs text-[#93a9c7] mt-1">
            AI-curated matching, mortgage purchasing power simulator, live negotiation tracker, and legal title vault.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/properties"
            className="btn-primary py-2.5 px-4 text-xs font-bold gap-2 shadow-lg w-fit"
          >
            Explore Verified Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 border border-white/15 flex items-center gap-4 shadow-xl rounded-2xl">
          <div className="p-3 bg-[#5f86ff]/20 text-[#5f86ff] rounded-xl border border-[#5f86ff]/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white block">{siteVisits.length || 3}</span>
            <span className="text-xs text-[#93a9c7] font-medium">Scheduled Site Visits</span>
          </div>
        </div>

        <div className="glass-card p-5 border border-white/15 flex items-center gap-4 shadow-xl rounded-2xl">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white block">{enquiries.length || 5}</span>
            <span className="text-xs text-[#93a9c7] font-medium">Active Seller Enquiries</span>
          </div>
        </div>

        <div className="glass-card p-5 border border-white/15 flex items-center gap-4 shadow-xl rounded-2xl">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white block">{sampleOffers.length}</span>
            <span className="text-xs text-[#93a9c7] font-medium">Active Offers Tracked</span>
          </div>
        </div>

        <div className="glass-card p-5 border border-white/15 flex items-center gap-4 shadow-xl rounded-2xl">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-400 block">
              {formatINR(purchasingPower.maxPropertyPrice)}
            </span>
            <span className="text-xs text-[#93a9c7] font-medium">Max Purchasing Budget</span>
          </div>
        </div>
      </div>

      {/* AI Curated Recommended Properties Grid */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30">
                <Sparkles className="w-3.5 h-3.5" /> PropAI Match Engine
              </span>
              <span className="text-xs text-[#93a9c7] font-mono">Personalized Recommendations</span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#5f86ff]" /> High Match AI Property Feed
            </h2>
          </div>

          <Link
            href="/properties"
            className="text-xs text-[#5f86ff] hover:text-white font-bold flex items-center gap-1 hover:underline transition-all"
          >
            View All 48+ Verified Listings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProperties.map((prop) => (
            <div
              key={prop.id}
              className="glass-panel group overflow-hidden border border-white/15 rounded-2xl flex flex-col justify-between hover:border-[#5f86ff]/50 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Property Image & Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040d1a] via-transparent to-black/30" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#5f86ff] text-white shadow-lg">
                      {prop.matchScore}% AI Match
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="p-1.5 rounded-full bg-slate-900/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md inline-block">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white font-bold">
                    <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-cyan-300 border border-cyan-500/30">
                      {prop.city}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-300 border border-amber-500/30 font-mono">
                      {formatINR(prop.pricePerSqft)}/sqft
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-white text-sm line-clamp-1 group-hover:text-[#5f86ff] transition-colors">
                      {prop.title}
                    </h3>
                    <p className="text-[11px] text-[#93a9c7] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#5f86ff] shrink-0" />
                      {prop.location}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-2 border-y border-white/10 text-xs">
                    <span className="text-[#93a9c7]">{prop.bedrooms} Bed • {prop.bathrooms} Bath</span>
                    <span className="font-mono text-white font-semibold">{prop.sqft.toLocaleString()} sqft</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xl font-black text-emerald-400 font-mono">
                      {formatINR(prop.price)}
                    </div>
                    <p className="text-[10px] text-cyan-200/90 bg-cyan-950/40 p-2 rounded-lg border border-cyan-500/20 italic line-clamp-2">
                      💡 {prop.matchReason}
                    </p>
                  </div>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {prop.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-semibold px-2 py-0.5 rounded bg-white/5 text-[#93a9c7] border border-white/10"
                      >
                        ✓ {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2 text-xs">
                <Link
                  href={`/properties/${prop.id}`}
                  className="py-2 px-2 text-center rounded-xl font-bold bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30 hover:bg-[#5f86ff] hover:text-white transition-all text-[11px]"
                >
                  View Details
                </Link>
                <Link
                  href={`/properties/${prop.id}`}
                  className="py-2 px-2 text-center rounded-xl font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all text-[11px]"
                >
                  Book Visit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offer & Purchase Negotiation Tracker */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4 rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/15 pb-3">
          <h3 className="font-extrabold text-white text-base flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#5f86ff]" />
            Offer & Purchase Negotiation Tracker
          </h3>
          <span className="text-xs font-semibold text-[#93a9c7] font-mono">Live Escrow & Offer Status</span>
        </div>

        <div className="divide-y divide-white/10">
          {sampleOffers.map((off) => (
            <div key={off.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-white text-sm">{off.title}</span>
                  <span className="text-[#93a9c7] font-medium">({off.city})</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      off.status === 'Accepted'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : off.status === 'Countered'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    }`}
                  >
                    {off.status}
                  </span>
                </div>
                <div className="text-[#93a9c7] flex items-center gap-3">
                  <span>
                    Your Offer: <strong className="text-[#5f86ff] font-mono">{formatINR(off.offeredAmount)}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Asking: <strong className="text-white font-mono">{formatINR(off.askingPrice)}</strong>
                  </span>
                </div>
                {off.sellerCounter && (
                  <div className="text-purple-300 font-semibold bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-xl w-fit flex items-center gap-2">
                    💬 Seller Counteroffer: <span className="font-mono font-bold text-white">{formatINR(off.sellerCounter)}</span>
                  </div>
                )}
              </div>

              <div className="text-right space-y-1 bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[11px] font-mono text-emerald-400 font-bold block flex items-center gap-1 justify-end">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  {off.escrowStatus}
                </span>
                <span className="text-[10px] text-[#93a9c7] block font-mono">Submitted: {off.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-Approved Bank Mortgage & Home Loan Offers */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Banknote className="w-3.5 h-3.5" /> Instant Banking API
              </span>
              <span className="text-xs text-[#93a9c7] font-mono">PropAI Direct Banking Network</span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Pre-Approved Home Loan & Sanction Offers
            </h2>
          </div>

          <div className="text-xs text-[#93a9c7]">
            Based on your CIBIL score (785) & income eligibility
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mortgageOffers.map((offer, idx) => (
            <div
              key={idx}
              className={`glass-panel p-5 border rounded-2xl flex flex-col justify-between space-y-4 relative ${
                offer.recommended
                  ? 'border-[#5f86ff] bg-[#5f86ff]/10 shadow-2xl'
                  : 'border-white/15'
              }`}
            >
              {offer.recommended && (
                <div className="absolute -top-3 right-4 bg-[#5f86ff] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-lg">
                  PropAI Recommended
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{offer.logo}</span>
                  <div>
                    <h3 className="font-black text-white text-sm">{offer.bankName}</h3>
                    <span className="text-[10px] text-emerald-400 font-bold block">{offer.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 py-3 border-y border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-[#93a9c7] block uppercase font-semibold">Interest Rate</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">{offer.interestRate}</span>
                    <span className="text-[9px] text-[#93a9c7] block">{offer.rateType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#93a9c7] block uppercase font-semibold">Pre-Approved Limit</span>
                    <span className="text-lg font-black text-white font-mono">{formatINR(offer.preApprovedLimit)}</span>
                    <span className="text-[9px] text-[#93a9c7] block">Max Tenure {offer.tenureYears} Yrs</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-[#93a9c7] block">Loan Highlights:</span>
                  {offer.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg flex items-center justify-center gap-2 mt-2">
                Download Digital Sanction Letter <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Due Diligence & Legal Title Vault */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Title Audit Engine
              </span>
              <span className="text-xs text-[#93a9c7] font-mono">Zero Fraud Guarantee</span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-cyan-400" /> Legal Title & Due Diligence Vault
            </h2>
          </div>
          <span className="text-xs text-cyan-300 bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-full font-bold">
            100% Verified Property Records
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dueDiligenceReports.map((report) => (
            <div key={report.id} className="glass-panel p-5 space-y-4 rounded-2xl border border-white/15">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-white">{report.propertyName}</h4>
                  <span className="text-xs text-[#93a9c7]">{report.city}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-400 font-bold block">Audit Score</span>
                  <span className="text-xl font-black text-emerald-400">{report.auditScore}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-[#93a9c7] block uppercase font-bold">Title Clearance</span>
                  <span className="font-bold text-white text-[11px]">{report.titleStatus}</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-[#93a9c7] block uppercase font-bold">Encumbrance (EC)</span>
                  <span className="font-bold text-emerald-300 text-[11px]">{report.encumbranceCertificate}</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-[#93a9c7] block uppercase font-bold">RERA Registration</span>
                  <span className="font-bold text-cyan-300 text-[11px]">{report.reraVerification}</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-[#93a9c7] block uppercase font-bold">Municipal Tax</span>
                  <span className="font-bold text-white text-[11px]">{report.taxReceipts}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] bg-cyan-950/30 p-3 rounded-xl border border-cyan-500/20 text-cyan-200">
                <span className="font-semibold">⚖️ Legal Sign-off: {report.lawyerSignoff}</span>
                <span className="font-mono text-emerald-400 font-bold">Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Neighborhood Vibe & Livability Index */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Compass className="w-3.5 h-3.5" /> Neighborhood AI Engine
              </span>
              <span className="text-xs text-[#93a9c7] font-mono">Location Analytics Aggregator</span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" /> AI Neighborhood Vibe & Livability Index
            </h2>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#93a9c7] font-medium">Select City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-900/80 text-white border border-white/20 text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#5f86ff]"
            >
              <option value="Bangalore" className="bg-slate-900 text-white">Bengaluru, KA</option>
              <option value="Mumbai" className="bg-slate-900 text-white">Mumbai, MH</option>
              <option value="Delhi NCR" className="bg-slate-900 text-white">Delhi NCR</option>
              <option value="Austin" className="bg-slate-900 text-white">Austin, TX</option>
              <option value="New York" className="bg-slate-900 text-white">New York, NY</option>
              <option value="Miami" className="bg-slate-900 text-white">Miami, FL</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
          <div className="glass-panel p-4 space-y-1 rounded-xl">
            <span className="text-[10px] font-bold text-[#93a9c7] uppercase tracking-wider block">Walk Score</span>
            <div className="text-2xl font-black text-emerald-400">{neighborhoodVibe.walkScore}/100</div>
            <span className="text-[10px] text-[#93a9c7]">Pedestrian Friendly</span>
          </div>

          <div className="glass-panel p-4 space-y-1 rounded-xl">
            <span className="text-[10px] font-bold text-[#93a9c7] uppercase tracking-wider block">Safety Index</span>
            <div className="text-2xl font-black text-[#5f86ff]">{neighborhoodVibe.safetyIndex}/100</div>
            <span className="text-[10px] text-[#93a9c7]">Low Crime Zone</span>
          </div>

          <div className="glass-panel p-4 space-y-1 rounded-xl">
            <span className="text-[10px] font-bold text-[#93a9c7] uppercase tracking-wider block">Transit Score</span>
            <div className="text-2xl font-black text-purple-400">{neighborhoodVibe.transitScore}/100</div>
            <span className="text-[10px] text-[#93a9c7]">Public Transit Hub</span>
          </div>

          <div className="glass-panel p-4 space-y-1 rounded-xl">
            <span className="text-[10px] font-bold text-[#93a9c7] uppercase tracking-wider block">School District</span>
            <div className="text-2xl font-black text-amber-400">{neighborhoodVibe.schoolRating}/10</div>
            <span className="text-[10px] text-[#93a9c7]">Top-Rated Education</span>
          </div>

          <div className="glass-panel p-4 col-span-2 lg:col-span-1 space-y-1 rounded-xl">
            <span className="text-[10px] font-bold text-[#93a9c7] uppercase tracking-wider block">Overall Livability</span>
            <div className="text-2xl font-black text-cyan-400">{neighborhoodVibe.overallLivability}/100</div>
            <span className="text-[10px] text-[#93a9c7]">Livability Rank</span>
          </div>
        </div>

        <div className="glass-panel p-4 flex flex-wrap items-center gap-2 text-xs rounded-xl">
          <span className="font-bold text-[#93a9c7]">Neighborhood Highlights:</span>
          {neighborhoodVibe.highlights.map((h, idx) => (
            <span key={idx} className="bg-cyan-500/20 text-cyan-300 font-semibold px-2.5 py-1 rounded-lg border border-cyan-500/30">
              ✦ {h}
            </span>
          ))}
        </div>
      </div>

      {/* Purchasing Power & Loan Approval Simulator */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30">
                <Sparkles className="w-3.5 h-3.5" /> AI Purchasing Engine
              </span>
              <span className="text-xs text-[#93a9c7] font-mono">DTI Cap: 36-43% Underwriting</span>
            </div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Calculator className="w-6 h-6 text-[#5f86ff]" /> Purchasing Power & Loan Approval Simulator
            </h2>
          </div>

          <div className="glass-panel px-4 py-2 text-right rounded-xl">
            <span className="text-[10px] text-[#93a9c7] font-bold uppercase block">Loan Eligibility Score</span>
            <span className="text-2xl font-black text-emerald-400">
              {purchasingPower.eligibilityScore}/100 ({purchasingPower.eligibilityStatus})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-6 space-y-4 text-xs font-semibold">
            <div>
              <label className="text-[#93a9c7] block mb-1">Annual Household Income (₹)</label>
              <input
                type="number"
                step="50000"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="w-full glass-input text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#93a9c7] block mb-1">Monthly Existing Debt (₹)</label>
                <input
                  type="number"
                  step="5000"
                  value={monthlyDebt}
                  onChange={(e) => setMonthlyDebt(Number(e.target.value))}
                  className="w-full glass-input text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[#93a9c7] block mb-1">Down Payment Savings (₹)</label>
                <input
                  type="number"
                  step="50000"
                  value={downPaymentSavings}
                  onChange={(e) => setDownPaymentSavings(Number(e.target.value))}
                  className="w-full glass-input text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[#93a9c7] block mb-1">Credit Score Tier</label>
              <select
                value={creditTier}
                onChange={(e) => setCreditTier(e.target.value as any)}
                className="w-full bg-slate-900/80 border border-white/20 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#5f86ff]"
              >
                <option value="excellent" className="bg-slate-900 text-white">Excellent (750+ CIBIL Score) • 8.50% Rate</option>
                <option value="good" className="bg-slate-900 text-white">Good (700-749 CIBIL Score) • 8.85% Rate</option>
                <option value="fair" className="bg-slate-900 text-white">Fair (650-699 CIBIL Score) • 9.50% Rate</option>
              </select>
            </div>
          </div>

          {/* Results Output Cards */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 space-y-1 rounded-xl">
              <span className="text-[10px] font-bold text-[#93a9c7] uppercase tracking-wider block">Max Property Price</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {formatINR(purchasingPower.maxPropertyPrice)}
              </div>
              <span className="text-[10px] text-[#93a9c7]">Based on FOIR ratio ({purchasingPower.dtiRatio}%)</span>
            </div>

            <div className="glass-panel p-4 space-y-1 rounded-xl">
              <span className="text-[10px] font-bold text-[#93a9c7] uppercase tracking-wider block">Max Loan Principal</span>
              <div className="text-2xl font-black text-[#5f86ff] font-mono">
                {formatINR(purchasingPower.maxLoanAmount)}
              </div>
              <span className="text-[10px] text-[#93a9c7]">20-Yr Home Loan @ {purchasingPower.estimatedInterestRate}%</span>
            </div>

            <div className="glass-panel p-4 space-y-1 rounded-xl">
              <span className="text-[10px] font-bold text-[#93a9c7] uppercase tracking-wider block">Est. Monthly Housing EMI</span>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {formatINR(purchasingPower.estimatedMonthlyMortgage)}/mo
              </div>
              <span className="text-[10px] text-[#93a9c7]">Includes Principal + Interest</span>
            </div>

            <div className="glass-panel p-4 space-y-1 rounded-xl">
              <span className="text-[10px] font-bold text-[#93a9c7] uppercase tracking-wider block">Est. Tax & Maintenance</span>
              <div className="text-2xl font-black text-purple-400 font-mono">
                {formatINR(purchasingPower.breakdown.propertyTaxEstimate + purchasingPower.breakdown.homeInsuranceEstimate)}/mo
              </div>
              <span className="text-[10px] text-[#93a9c7]">Municipal & HOA Estimate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Access Digital Keys Quick Drawer */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            Smart Lock Digital PIN Keys & Self-Guided Tour Access
          </h3>
          <span className="text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
            IoT Seam / Yale Gateway
          </span>
        </div>

        {siteVisits.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-4 space-y-3 rounded-xl border border-white/15">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white line-clamp-1">The Sky View Glass Penthouse</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  🔓 Unlocked
                </span>
              </div>
              <div className="flex items-center justify-between glass p-3 border border-white/15 rounded-xl">
                <span className="text-xs text-[#93a9c7]">Single-Use Access PIN:</span>
                <span className="font-mono text-xl font-extrabold text-emerald-400 tracking-wider">
                  884-902
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#93a9c7]">
                <span>Visit Date: 2026-10-04 @ 11:00 AM</span>
                <span className="text-[#5f86ff] font-semibold">Yale Smart Gateway</span>
              </div>
            </div>

            <div className="glass-panel p-4 space-y-3 rounded-xl border border-white/15">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white line-clamp-1">Oberoi Sky Heights Luxury Suite</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  🔒 Locked (Passcode Ready)
                </span>
              </div>
              <div className="flex items-center justify-between glass p-3 border border-white/15 rounded-xl">
                <span className="text-xs text-[#93a9c7]">Single-Use Access PIN:</span>
                <span className="font-mono text-xl font-extrabold text-cyan-400 tracking-wider">
                  419-550
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#93a9c7]">
                <span>Visit Date: 2026-10-05 @ 03:30 PM</span>
                <span className="text-[#5f86ff] font-semibold">Seam IoT Gateway</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteVisits.map((visit) => (
              <div key={visit.id} className="glass-panel p-4 space-y-3 rounded-xl border border-white/15">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white line-clamp-1">{visit.property?.title || 'Self-Guided Tour'}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {visit.doorStatus === 'unlocked' ? '🔓 Unlocked' : '🔒 Locked'}
                  </span>
                </div>

                <div className="flex items-center justify-between glass p-3 border border-white/15 rounded-xl">
                  <span className="text-xs text-[#93a9c7]">Single-Use Access PIN:</span>
                  <span className="font-mono text-xl font-extrabold text-emerald-400 tracking-wider">
                    {visit.pinCode || '884-902'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#93a9c7]">
                  <span>Date: {visit.requestedDate || '2026-10-04'} @ {visit.requestedTime || '11:00 AM'}</span>
                  <span className="text-[#5f86ff] font-semibold">{visit.lockProvider || 'Seam'} Gateway</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Property Comparison Matrix */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4 rounded-2xl">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#5f86ff]" />
          Property Decision & ROI Comparison Matrix
        </h3>

        <div className="overflow-x-auto border border-white/15 rounded-xl glass">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/10 font-bold text-[#eaf2ff] border-b border-white/15">
              <tr>
                <th className="p-3">Property</th>
                <th className="p-3">Price</th>
                <th className="p-3">Price / Sqft</th>
                <th className="p-3">Est. Cap Rate</th>
                <th className="p-3">10-Yr Est. Return</th>
                <th className="p-3">Location Score</th>
                <th className="p-3">AI Preference Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-[#93a9c7]">
              {recommendedProperties.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-white">
                    <Link href={`/properties/${item.id}`} className="hover:text-[#5f86ff]">
                      {item.title} ({item.city})
                    </Link>
                  </td>
                  <td className="p-3 font-semibold text-[#5f86ff] font-mono">{formatINR(item.price)}</td>
                  <td className="p-3 text-[#93a9c7] font-mono">{formatINR(item.pricePerSqft)} / sqft</td>
                  <td className="p-3 font-bold text-emerald-400 font-mono">8.5%</td>
                  <td className="p-3 font-bold text-sky-400 font-mono">+14.2%</td>
                  <td className="p-3 text-white font-mono">94/100</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30">
                      {item.matchScore}% Match
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function BuyerDashboard() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-[#93a9c7] font-semibold">Loading Buyer Command Center...</div>}>
      <BuyerDashboardContent />
    </React.Suspense>
  );
}
