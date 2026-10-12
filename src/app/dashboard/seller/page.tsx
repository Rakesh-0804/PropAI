'use client';

import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Building2,
  Eye,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Zap,
  BarChart3,
  Wand2,
  Calculator,
  Sparkles,
  UserCheck,
  DollarSign,
  Calendar,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { detectDuplicateListing } from '@/lib/ai/duplicateDetector';
import { scoreBuyerLeads, forecastMarketLiquidity } from '@/lib/ai/sellerRadar';
import SmartAccessGateway from '@/components/SmartAccessGateway';
import AiCopyGeneratorModal from '@/components/AiCopyGeneratorModal';
import { formatINR } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';

function SellerDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const unauthorizedNotice = searchParams.get('unauthorized');
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [siteVisits, setSiteVisits] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Net Proceeds Calculator Inputs (INR)
  const [targetListingPrice, setTargetListingPrice] = useState<number>(18000000);
  const [commissionRate, setCommissionRate] = useState<number>(2.0); // 2%
  const [closingCostsPct, setClosingCostsPct] = useState<number>(1.0); // 1.0%
  const [mortgagePayoff, setMortgagePayoff] = useState<number>(5000000);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 650000,
    city: 'Bangalore',
    address: '',
    bedrooms: 3,
    bathrooms: 2,
    sizeSqft: 2200,
    propertyType: 'house',
    mediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  });

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      const [vRes, eRes] = await Promise.all([
        fetch('/api/visits?role=seller'),
        fetch('/api/enquiries'),
      ]);
      const vData = await vRes.json();
      const eData = await eRes.json();
      setSiteVisits(vData.visits || []);
      setEnquiries(eData.enquiries || []);
    } catch (err) {
      console.error('Failed to fetch seller data', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateWarning(null);

    const dupCheck = detectDuplicateListing(
      {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        city: formData.city,
        address: formData.address,
        sizeSqft: Number(formData.sizeSqft),
        bedrooms: Number(formData.bedrooms),
      },
      [
        {
          id: 'existing-1',
          title: 'Luxury Glass Penthouse with Panoramic Skyline Views',
          description: 'Experience pinnacle urban luxury...',
          price: 1850000,
          city: 'New York',
          address: '450 Park Avenue, Apt 42B',
          sizeSqft: 2400,
        },
      ]
    );

    if (dupCheck.isDuplicate) {
      setDuplicateWarning(dupCheck.reason || 'High duplicate similarity flagged.');
      return;
    }

    setIsSuccess(true);
  };

  // Sold Properties with complete Buyer Data & Transaction details
  const soldProperties = [
    {
      id: 'sold-101',
      title: 'Sobha Royal Pavilion 4BHK Penthouse',
      location: 'Sarjapur Road, Bangalore',
      listPrice: 24500000,
      soldPrice: 23800000,
      dom: 19,
      soldDate: '2026-08-14',
      buyer: {
        name: 'Dr. Ananya Sharma',
        email: 'ananya.sharma@medmail.in',
        phone: '+91 98450 12890',
        financing: 'HDFC Home Loan (80%) + Self Cash (20%)',
        agent: 'Rajeev Malhotra (Re/Max Premier)',
      },
      deedStatus: 'Deed Registered & Stamped',
      smartLockHandover: 'Handover Completed (PIN Revoked)',
    },
    {
      id: 'sold-102',
      title: 'Oberoi Sky City Luxury Duplex Suite',
      location: 'Borivali East, Mumbai',
      listPrice: 42000000,
      soldPrice: 41500000,
      dom: 24,
      soldDate: '2026-07-28',
      buyer: {
        name: 'Vikramaditya Roy',
        email: 'v.roy@techinvest.io',
        phone: '+91 98200 44512',
        financing: '100% Wire Transfer / Cash Escrow',
        agent: 'Priya Desai (Colliers International)',
      },
      deedStatus: 'Registry Completed (Sub-Registrar Mumbai)',
      smartLockHandover: 'Ownership Transferred via Seam App',
    },
    {
      id: 'sold-103',
      title: 'DLF The Camellias Ultra Executive Residence',
      location: 'Golf Course Road, Gurgaon',
      listPrice: 89000000,
      soldPrice: 87500000,
      dom: 12,
      soldDate: '2026-06-19',
      buyer: {
        name: 'Rajesh & Neha Malhotra',
        email: 'malhotra.corp@gmail.com',
        phone: '+91 99100 88234',
        financing: 'ICICI Bank HNW Mortgage Approval',
        agent: 'Karan Singhania (Knight Frank)',
      },
      deedStatus: 'Final Conveyance Deed Executed',
      smartLockHandover: 'Smart Key Re-assigned to Buyer',
    },
    {
      id: 'sold-104',
      title: 'Prestige Golfshire Luxury Pool Villa',
      location: 'Nandi Hills, Bangalore',
      listPrice: 38000000,
      soldPrice: 37200000,
      dom: 31,
      soldDate: '2026-05-04',
      buyer: {
        name: 'Suresh Kumar & Family',
        email: 'skumar.enterprise@yahoo.in',
        phone: '+91 97311 00299',
        financing: 'Axis Bank Home Credit',
        agent: 'Direct Seller Deal (Zero Brokerage)',
      },
      deedStatus: 'Property Tax & Khata Transferred',
      smartLockHandover: 'Physical & Digital Keys Delivered',
    },
  ];

  const activeSellerListings = [
    {
      id: 'active-1',
      title: 'Modern Glass Villa with Infinity Pool',
      city: 'Bangalore',
      location: 'Indiranagar, Bangalore',
      price: 18500000,
      propertyType: 'Villa',
      views: 482,
      enquiriesCount: 14,
      status: 'Verified & Live',
      daysListed: 8,
      leadCount: 5,
    },
    {
      id: 'active-2',
      title: 'Skyline Terrace Penthouse 3BHK',
      city: 'Mumbai',
      location: 'Worli Sea Face, Mumbai',
      price: 36000000,
      propertyType: 'Penthouse',
      views: 310,
      enquiriesCount: 9,
      status: 'Verified & Live',
      daysListed: 14,
      leadCount: 3,
    },
    {
      id: 'active-3',
      title: 'Eco-Smart Gated Residence with Solar Panel',
      city: 'Delhi NCR',
      location: 'Vasant Vihar, New Delhi',
      price: 24000000,
      propertyType: 'House',
      views: 225,
      enquiriesCount: 7,
      status: 'Verified & Live',
      daysListed: 21,
      leadCount: 2,
    },
    {
      id: 'active-4',
      title: 'Lakeview Smart Duplex Apartment',
      city: 'Bangalore',
      location: 'HSR Layout, Bangalore',
      price: 14500000,
      propertyType: 'Apartment',
      views: 198,
      enquiriesCount: 6,
      status: 'Under Inspection',
      daysListed: 3,
      leadCount: 4,
    },
  ];

  const buyerLeads = scoreBuyerLeads(siteVisits, enquiries);
  const liquidityForecast = forecastMarketLiquidity(targetListingPrice, 2400, 'Bangalore');

  // Net Proceeds calculation
  const totalCommissionAmount = Math.round(targetListingPrice * (commissionRate / 100));
  const totalClosingCostsAmount = Math.round(targetListingPrice * (closingCostsPct / 100));
  const estimatedNetProceeds = Math.round(targetListingPrice - totalCommissionAmount - totalClosingCostsAmount - mortgagePayoff);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#eaf2ff]">
      {unauthorizedNotice && (
        <div className="glass p-4 border border-amber-400/30 text-amber-200 text-xs font-semibold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>🔒 Admin Access Restricted: Admin command center requires an Admin account. Redirected to Seller Portal.</span>
          </div>
          <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
            Seller Mode
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#eaf2ff] tracking-tight">
            Seller & Agent Portal
          </h1>
          <p className="text-xs text-[#93a9c7] mt-1">
            Predictive lead intent scoring, Days-on-Market (DOM) liquidity forecasting, and AI marketing generator.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCopyModal(true)}
            className="chip chip-active text-xs font-bold gap-2 cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-[#5f86ff]" /> AI Description Generator
          </button>

          <button
            onClick={() => {
              setShowAddForm(true);
              setIsSuccess(false);
              setDuplicateWarning(null);
            }}
            className="btn-primary py-2.5 px-4 text-xs font-bold gap-2 shadow-lg cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Create New Listing
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 border border-white/15 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-[#5f86ff]/20 text-[#5f86ff] rounded-xl border border-[#5f86ff]/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white block">4</span>
            <span className="text-xs text-[#93a9c7] font-medium">Active Properties</span>
          </div>
        </div>

        <div className="glass-card p-5 border border-white/15 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-rose-400 block">
              {buyerLeads.filter((l) => l.intentGrade === 'HOT').length}
            </span>
            <span className="text-xs text-[#93a9c7] font-medium">Hot Buyer Leads</span>
          </div>
        </div>

        <div className="glass-card p-5 border border-white/15 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white block">1,240</span>
            <span className="text-xs text-[#93a9c7] font-medium">Listing Views</span>
          </div>
        </div>

        <div className="glass-card p-5 border border-white/15 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white block">{enquiries.length}</span>
            <span className="text-xs text-[#93a9c7] font-medium">Enquiries Received</span>
          </div>
        </div>
      </div>

      {/* AI Buyer Lead Intent Radar */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> AI Intent Scoring Engine
              </span>
              <span className="text-xs text-[#93a9c7] font-medium">Real-Time Lead Grading</span>
            </div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Buyer Lead Intent Radar
            </h3>
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {buyerLeads.map((lead) => (
            <div key={lead.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm">{lead.buyerName}</span>
                  <span className="text-xs text-[#93a9c7] font-mono">({lead.buyerEmail})</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      lead.intentGrade === 'HOT'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : lead.intentGrade === 'WARM'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-white/10 text-white border-white/20'
                    }`}
                  >
                    🔥 {lead.intentGrade} ({lead.intentScore}/100)
                  </span>
                </div>

                <div className="text-xs text-[#93a9c7] font-medium">Target: {lead.propertyTitle}</div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {lead.signals.map((sig, i) => (
                    <span key={i} className="text-[10px] glass px-2 py-0.5 text-[#eaf2ff] font-semibold">
                      ✓ {sig}
                    </span>
                  ))}
                </div>

                <div className="text-xs font-semibold text-[#5f86ff] bg-[#5f86ff]/10 px-3 py-1.5 rounded-lg border border-[#5f86ff]/20 w-fit">
                  💡 Recommended Action: {lead.recommendedAction}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-[#93a9c7] font-medium block">Active {lead.lastActive}</span>
                <a
                  href={`mailto:${lead.buyerEmail}?subject=Regarding ${encodeURIComponent(lead.propertyTitle)}`}
                  className="mt-2 inline-block btn-primary px-3 py-1.5 text-xs font-bold shadow-md"
                >
                  Contact Buyer
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seller Net Proceeds & Commission Closing Calculator */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/15 pb-3">
          <div className="space-y-1">
            <span className="text-xs text-emerald-300 font-bold bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full">
              Financial Underwriting
            </span>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" /> Seller Net Proceeds & Commission Calculator
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-3 text-xs font-semibold text-[#93a9c7]">
            <div>
              <label className="block mb-1">Target Sale Price (₹)</label>
              <input
                type="number"
                step="100000"
                value={targetListingPrice}
                onChange={(e) => setTargetListingPrice(Number(e.target.value))}
                className="w-full glass-input text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Broker Commission (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full glass-input text-white font-mono"
                />
              </div>

              <div>
                <label className="block mb-1">Closing & Title Fees (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={closingCostsPct}
                  onChange={(e) => setClosingCostsPct(Number(e.target.value))}
                  className="w-full glass-input text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Existing Mortgage Payoff (₹)</label>
              <input
                type="number"
                step="50000"
                value={mortgagePayoff}
                onChange={(e) => setMortgagePayoff(Number(e.target.value))}
                className="w-full glass-input text-white font-mono"
              />
            </div>
          </div>

          <div className="lg:col-span-7 glass-panel p-5 border border-white/15 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#93a9c7] uppercase tracking-wider block">Estimated Net Cash at Closing</span>
              <div className="text-4xl font-black text-emerald-400 mt-1">
                {formatINR(estimatedNetProceeds)}
              </div>
              <span className="text-xs text-[#93a9c7]">Net proceeds after commission, title fees, and loan payoff.</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs border-t border-white/10 pt-3">
              <div>
                <span className="text-[10px] text-[#93a9c7] block font-semibold">Total Commission</span>
                <span className="font-mono text-rose-400 font-bold">-{formatINR(totalCommissionAmount)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#93a9c7] block font-semibold">Closing Costs</span>
                <span className="font-mono text-amber-400 font-bold">-{formatINR(totalClosingCostsAmount)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#93a9c7] block font-semibold">Mortgage Payoff</span>
                <span className="font-mono text-[#5f86ff] font-bold">-{formatINR(mortgagePayoff)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Days-On-Market (DOM) Liquidity Forecast */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30">
                <Sparkles className="w-3.5 h-3.5" /> Market Liquidity Model Active
              </span>
              <span className="text-xs text-[#93a9c7] font-mono">
                Demand Index: {liquidityForecast.marketDemandScore}/100 ({liquidityForecast.liquidityIndex} Demand)
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#5f86ff]" /> Days-on-Market (DOM) Liquidity Forecast
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 glass-panel p-5 border border-white/15 space-y-4">
            <span className="text-xs font-bold text-[#93a9c7] uppercase tracking-wider block">Estimated Days on Market (DOM)</span>
            <div className="text-4xl font-black text-[#5f86ff]">{liquidityForecast.estimatedDOM} Days</div>
            <p className="text-xs text-[#93a9c7]">
              Estimated closing timeline at current price ({formatINR(liquidityForecast.currentPrice)}).
            </p>

            <div className="border-t border-white/10 pt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#93a9c7]">Optimal Target Price:</span>
                <span className="font-mono text-emerald-400 font-bold">{formatINR(liquidityForecast.optimalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#93a9c7]">14-Day Fast Sale Price:</span>
                <span className="font-mono text-amber-400 font-bold">{formatINR(liquidityForecast.fasterSalePrice)}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 glass-panel p-5 border border-white/15 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Strategy Recommendations</h4>
            <div className="space-y-2 text-xs">
              {liquidityForecast.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 glass p-3 border border-white/10 text-[#eaf2ff]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Properties Portfolio */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#5f86ff] font-extrabold text-xs uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4 text-[#5f86ff]" /> Active Portfolio
            </div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              My Active Seller Listings ({activeSellerListings.length})
            </h3>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary py-2 px-3 text-xs font-bold gap-1.5 shadow-md w-fit"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add Property
          </button>
        </div>

        <div className="overflow-x-auto border border-white/15 rounded-xl glass">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/10 font-bold text-[#eaf2ff] border-b border-white/15">
              <tr>
                <th className="p-3">Property Title</th>
                <th className="p-3">Location</th>
                <th className="p-3">Asking Price</th>
                <th className="p-3">Views</th>
                <th className="p-3">Leads</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-[#93a9c7]">
              {activeSellerListings.map((prop) => (
                <tr key={prop.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-white">{prop.title}</td>
                  <td className="p-3 text-[#93a9c7]">{prop.location}</td>
                  <td className="p-3 font-semibold text-[#5f86ff]">{formatINR(prop.price)}</td>
                  <td className="p-3 text-white font-mono">{prop.views} views</td>
                  <td className="p-3 font-bold text-rose-300">{prop.leadCount} Active Leads</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {prop.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recently Sold Properties & Closed Transactions with Buyer Data */}
      <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <BadgeCheck className="w-4 h-4 text-emerald-400" /> Verified Closing Records
            </div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Recently Sold Properties & Buyer Records ({soldProperties.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
            Total Closed Value: ₹19.45 Cr
          </span>
        </div>

        <div className="space-y-4">
          {soldProperties.map((sold) => (
            <div key={sold.id} className="glass-panel p-5 border border-white/15 space-y-4 rounded-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-white text-base">{sold.title}</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      CLOSED & SOLD
                    </span>
                  </div>
                  <p className="text-xs text-[#93a9c7] mt-0.5">{sold.location} • Listed for {sold.dom} Days</p>
                </div>

                <div className="text-left lg:text-right">
                  <span className="text-[10px] text-[#93a9c7] uppercase font-bold block">Final Realized Sale Price</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {formatINR(sold.soldPrice)}
                  </div>
                  <span className="text-[10px] text-[#93a9c7]">Asking: {formatINR(sold.listPrice)}</span>
                </div>
              </div>

              {/* Buyer & Transaction Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="glass p-3 rounded-xl space-y-1 border border-white/10">
                  <span className="text-[10px] text-[#93a9c7] font-bold uppercase flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#5f86ff]" /> Buyer Information
                  </span>
                  <div className="font-bold text-white">{sold.buyer.name}</div>
                  <div className="text-[#93a9c7] font-mono text-[11px]">{sold.buyer.email}</div>
                  <div className="text-[#93a9c7] text-[11px]">{sold.buyer.phone}</div>
                </div>

                <div className="glass p-3 rounded-xl space-y-1 border border-white/10">
                  <span className="text-[10px] text-[#93a9c7] font-bold uppercase flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Buyer Financing
                  </span>
                  <div className="font-semibold text-emerald-300">{sold.buyer.financing}</div>
                  <div className="text-[11px] text-[#93a9c7]">Agent: {sold.buyer.agent}</div>
                </div>

                <div className="glass p-3 rounded-xl space-y-1 border border-white/10">
                  <span className="text-[10px] text-[#93a9c7] font-bold uppercase flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-purple-400" /> Title & Registry Status
                  </span>
                  <div className="font-bold text-purple-300">{sold.deedStatus}</div>
                  <div className="text-[11px] text-[#93a9c7]">Date Closed: {sold.soldDate}</div>
                </div>

                <div className="glass p-3 rounded-xl space-y-1 border border-white/10">
                  <span className="text-[10px] text-[#93a9c7] font-bold uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Smart Access Handover
                  </span>
                  <div className="font-bold text-sky-300">{sold.smartLockHandover}</div>
                  <div className="text-[11px] text-emerald-400 font-mono">Status: 100% Completed</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IoT Smart Access Management Console */}
      <SmartAccessGateway isOwnerView={true} />

      {/* AI Copy Generator Modal */}
      <AiCopyGeneratorModal isOpen={showCopyModal} onClose={() => setShowCopyModal(false)} />

      {/* Create Listing Form Modal */}
      {showAddForm && (
        <div className="glass-card p-6 border border-white/20 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/15 pb-3">
            <h3 className="font-bold text-white text-lg">Add New Real Estate Property</h3>
            <button onClick={() => setShowAddForm(false)} className="text-xs text-[#93a9c7] font-semibold hover:text-white">
              Close
            </button>
          </div>

          {isSuccess ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="font-bold text-white text-lg">Listing Submitted to Admin Gate!</h4>
              <p className="text-xs text-[#93a9c7]">
                Your listing has passed duplicate checks and is queued for Admin Verification approval.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-[#93a9c7]">
              {duplicateWarning && (
                <div className="p-3 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs">
                  ⚠️ AI Duplicate Alert: {duplicateWarning}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Property Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Glass Villa with Pool"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block mb-1">Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Full street address..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    className="w-full glass-input text-white"
                  />
                </div>

                <div>
                  <label className="block mb-1">Living Area (Sqft)</label>
                  <input
                    type="number"
                    value={formData.sizeSqft}
                    onChange={(e) => setFormData({ ...formData, sizeSqft: Number(e.target.value) })}
                    className="w-full glass-input text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter property features, architectural details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full glass-input text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 text-sm font-bold shadow-lg cursor-pointer"
              >
                Submit Listing to Platform
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default function SellerDashboard() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-[#93a9c7] font-semibold">Loading Seller Portal...</div>}>
      <SellerDashboardContent />
    </React.Suspense>
  );
}
