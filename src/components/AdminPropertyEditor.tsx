'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Building2, MapPin, DollarSign, Layers, Image as ImageIcon, TrendingUp, Loader2, Percent, Receipt, ShieldAlert } from 'lucide-react';

const AMENITY_OPTIONS = [
  'Swimming Pool', 'Gym', 'Parking', 'Security', 'Lift', 'Power Backup',
  'Garden', 'Clubhouse', 'Play Area', 'CCTV', 'Intercom', 'WiFi',
  'Modular Kitchen', 'Air Conditioning', 'Balcony', 'Terrace', 'Servant Room',
  'Study Room', 'Vastu Compliant', 'Pet Friendly', 'Solar Power', 'EV Charging',
];

interface MediaItem {
  mediaUrl: string;
  type: string;
  caption: string;
}

interface AdminPropertyEditorProps {
  property: Record<string, unknown> | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AdminPropertyEditor({ property, onClose, onSaved }: AdminPropertyEditorProps) {
  const isNew = !property;
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'sale',
    propertyType: 'apartment',
    status: 'available',
    verifiedStatus: 'verified',
    featured: false,
    address: '',
    city: '',
    state: '',
    zip: '',
    latitude: '',
    longitude: '',
    sizeSqft: '',
    bedrooms: '',
    bathrooms: '',
    price: '',
    amenities: [] as string[],
    // Presiding financial rates, amounts, interest, and taxes
    expectedRent: '',
    interestRate: '8.5',
    downPaymentPercent: '20',
    vacancyRate: '5',
    propertyTaxRate: '1.2', // % p.a.
    annualPropertyTax: '', // ₹ / yr
    monthlyMaintenance: '3500', // ₹ / month
    insuranceRate: '0.25', // % p.a.
    mediaItems: [] as MediaItem[],
  });

  useEffect(() => {
    if (property) {
      const uw = Array.isArray(property.underwritingReports) && (property.underwritingReports as unknown[]).length > 0
        ? (property.underwritingReports[0] as Record<string, unknown>)
        : null;

      let taxHistory: Record<string, unknown>[] = [];
      try {
        if (uw?.taxHistoryJson) {
          taxHistory = JSON.parse(String(uw.taxHistoryJson));
        }
      } catch {
        taxHistory = [];
      }
      const initialTax = taxHistory.length > 0 && taxHistory[0]?.taxAmount ? String(taxHistory[0].taxAmount) : '';

      setForm({
        title: String(property.title || ''),
        description: String(property.description || ''),
        type: String(property.type || 'sale'),
        propertyType: String(property.propertyType || 'apartment'),
        status: String(property.status || 'available'),
        verifiedStatus: String(property.verifiedStatus || 'verified'),
        featured: Boolean(property.featured),
        address: String(property.address || ''),
        city: String(property.city || ''),
        state: String(property.state || ''),
        zip: String(property.zip || ''),
        latitude: String(property.latitude || ''),
        longitude: String(property.longitude || ''),
        sizeSqft: String(property.sizeSqft || ''),
        bedrooms: String(property.bedrooms || ''),
        bathrooms: String(property.bathrooms || ''),
        price: String(property.price || ''),
        amenities: Array.isArray(property.amenities) ? (property.amenities as string[]) : [],
        expectedRent: uw ? String(uw.expectedRent || '') : '',
        interestRate: uw ? String(uw.interestRate || '8.5') : '8.5',
        downPaymentPercent: uw ? String(uw.downPaymentPercent || '20') : '20',
        vacancyRate: uw ? String(uw.vacancyRate || '5') : '5',
        propertyTaxRate: '1.2',
        annualPropertyTax: initialTax || (Number(property.price || 0) * 0.012 ? String(Math.round(Number(property.price || 0) * 0.012)) : ''),
        monthlyMaintenance: '3500',
        insuranceRate: '0.25',
        mediaItems: Array.isArray(property.media)
          ? (property.media as Record<string, unknown>[]).map((m) => ({
              mediaUrl: String(m.mediaUrl || ''),
              type: String(m.type || 'image'),
              caption: String(m.caption || ''),
            }))
          : [],
      });
    }
  }, [property]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const toggleAmenity = (a: string) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  };

  const addMedia = () => setForm((f) => ({ ...f, mediaItems: [...f.mediaItems, { mediaUrl: '', type: 'image', caption: '' }] }));
  const removeMedia = (i: number) => setForm((f) => ({ ...f, mediaItems: f.mediaItems.filter((_, idx) => idx !== i) }));
  const updateMedia = (i: number, k: string, v: string) =>
    setForm((f) => ({
      ...f,
      mediaItems: f.mediaItems.map((m, idx) => (idx === i ? { ...m, [k]: v } : m)),
    }));

  // Presiding Financial Calculations
  const price = parseFloat(form.price) || 0;
  const expectedRent = parseFloat(form.expectedRent) || (price > 0 ? Math.round(price * 0.004) : 0);
  const interestRate = parseFloat(form.interestRate) || 8.5;
  const downPaymentPercent = parseFloat(form.downPaymentPercent) || 20;
  const vacancyRate = parseFloat(form.vacancyRate) || 5;
  const propertyTaxRate = parseFloat(form.propertyTaxRate) || 1.2;
  const annualPropertyTax = parseFloat(form.annualPropertyTax) || (price * (propertyTaxRate / 100));
  const monthlyMaintenance = parseFloat(form.monthlyMaintenance) || 0;
  const annualMaintenance = monthlyMaintenance * 12;
  const insuranceRate = parseFloat(form.insuranceRate) || 0.25;
  const annualInsurance = price * (insuranceRate / 100);

  const downPaymentAmount = price * (downPaymentPercent / 100);
  const loanAmt = price - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const n = 360; // 30 years
  const emi = loanAmt > 0 && monthlyRate > 0 ? (loanAmt * (monthlyRate * Math.pow(1 + monthlyRate, n))) / (Math.pow(1 + monthlyRate, n) - 1) : 0;
  const annualDebt = emi * 12;

  const grossAnnualRent = expectedRent * 12;
  const effectiveGrossIncome = grossAnnualRent * (1 - vacancyRate / 100);
  const totalOperatingExpenses = annualPropertyTax + annualMaintenance + annualInsurance + (effectiveGrossIncome * 0.05); // including 5% mgmt
  const noi = Math.max(0, effectiveGrossIncome - totalOperatingExpenses);
  const capRate = price > 0 ? (noi / price) * 100 : 0;
  const dscr = annualDebt > 0 ? noi / annualDebt : 999;
  const annualCashFlow = noi - annualDebt;
  const cashOnCash = downPaymentAmount > 0 ? (annualCashFlow / downPaymentAmount) * 100 : 0;
  const grossYield = price > 0 ? (grossAnnualRent / price) * 100 : 0;
  const projectedIRR = Math.max(0, capRate * 1.25 + 3.5); // 10-yr IRR with capital appreciation

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        sizeSqft: parseFloat(form.sizeSqft) || 0,
        bedrooms: parseInt(form.bedrooms) || 0,
        bathrooms: parseFloat(form.bathrooms) || 0,
        latitude: parseFloat(form.latitude) || 0,
        longitude: parseFloat(form.longitude) || 0,
        expectedRent,
        interestRate,
        downPaymentPercent,
        vacancyRate,
        propertyTaxRate,
        annualPropertyTax,
        monthlyMaintenance,
        noi,
        capRate,
        dscr,
        cashOnCashReturn: cashOnCash,
        irr: projectedIRR,
      };

      const url = isNew ? '/api/admin/properties' : `/api/admin/properties/${(property as Record<string, unknown>).id}`;
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save property');
      setSuccess(data.message || 'Saved successfully!');
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { label: 'Basic Info', icon: Building2 },
    { label: 'Location', icon: MapPin },
    { label: 'Details', icon: Layers },
    { label: 'Rates, Interest & Taxes', icon: TrendingUp },
    { label: 'Media & 360', icon: ImageIcon },
  ];

  const inputCls =
    'w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-[#93a9c7] focus:outline-none focus:border-[#5f86ff]/60 focus:bg-white/10 transition-colors';
  const labelCls = 'block text-xs font-bold text-[#93a9c7] mb-1 uppercase tracking-wider';
  const selectCls = inputCls + ' cursor-pointer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col glass-card border border-white/20 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/15 shrink-0 bg-white/5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30">
                Admin Console
              </span>
              <h2 className="text-lg font-black text-white">
                {isNew ? '➕ Create New Property Listing' : '✏️ Edit Property & Underwriting Rates'}
              </h2>
            </div>
            {!isNew && (
              <p className="text-xs text-[#93a9c7] mt-0.5">
                Editing: <span className="text-white font-semibold">{String((property as Record<string, unknown>).title || '')}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-[#93a9c7] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex gap-1.5 p-3 border-b border-white/10 shrink-0 overflow-x-auto bg-black/20">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === i
                    ? 'bg-[#5f86ff] text-white shadow-md shadow-[#5f86ff]/30'
                    : 'text-[#93a9c7] hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 0: Basic Info */}
          {activeTab === 0 && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Property Title *</label>
                <input
                  className={inputCls}
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="e.g. Prestige HighLine Penthouse with Private Terrace"
                />
              </div>
              <div>
                <label className={labelCls}>Description *</label>
                <textarea
                  className={inputCls + ' resize-none h-24'}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Detailed description, architecture details, view, highlights..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Listing Type *</label>
                  <select className={selectCls} value={form.type} onChange={(e) => set('type', e.target.value)}>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Property Category *</label>
                  <select className={selectCls} value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)}>
                    {[
                      'apartment',
                      'house',
                      'villa',
                      'condo',
                      'commercial',
                      'plot',
                      'independent_house',
                      'builder_floor',
                      'farmhouse',
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Market Status</label>
                  <select className={selectCls} value={form.status} onChange={(e) => set('status', e.target.value)}>
                    <option value="available">Available</option>
                    <option value="pending">Under Contract / Pending</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Admin Verification Status</label>
                  <select className={selectCls} value={form.verifiedStatus} onChange={(e) => set('verifiedStatus', e.target.value)}>
                    <option value="verified">Verified (Published Live) ✓</option>
                    <option value="pending">Pending Admin Gate</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                  className="w-4 h-4 accent-[#5f86ff] cursor-pointer"
                />
                <label htmlFor="featured" className="text-sm font-bold text-white cursor-pointer select-none">
                  ⭐ Mark as Featured Listing (prominently shown on Homepage hero and top results)
                </label>
              </div>
            </div>
          )}

          {/* TAB 1: Location */}
          {activeTab === 1 && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Full Street Address *</label>
                <input
                  className={inputCls}
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="e.g. 100ft Road, Indiranagar, Landmark Near Metro"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>City *</label>
                  <input className={inputCls} value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Bangalore" />
                </div>
                <div>
                  <label className={labelCls}>State *</label>
                  <input className={inputCls} value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="Karnataka" />
                </div>
                <div>
                  <label className={labelCls}>Postal PIN Code</label>
                  <input className={inputCls} value={form.zip} onChange={(e) => set('zip', e.target.value)} placeholder="560038" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Latitude Coordinate</label>
                  <input
                    type="number"
                    step="any"
                    className={inputCls}
                    value={form.latitude}
                    onChange={(e) => set('latitude', e.target.value)}
                    placeholder="12.9719"
                  />
                </div>
                <div>
                  <label className={labelCls}>Longitude Coordinate</label>
                  <input
                    type="number"
                    step="any"
                    className={inputCls}
                    value={form.longitude}
                    onChange={(e) => set('longitude', e.target.value)}
                    placeholder="77.6412"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Details */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Built-up Area (sq.ft) *</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.sizeSqft}
                    onChange={(e) => set('sizeSqft', e.target.value)}
                    placeholder="2450"
                  />
                </div>
                <div>
                  <label className={labelCls}>Bedrooms (BHK)</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.bedrooms}
                    onChange={(e) => set('bedrooms', e.target.value)}
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className={labelCls}>Bathrooms</label>
                  <input
                    type="number"
                    step="0.5"
                    className={inputCls}
                    value={form.bathrooms}
                    onChange={(e) => set('bathrooms', e.target.value)}
                    placeholder="3"
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Base Price Amount (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5f86ff] font-bold">₹</span>
                  <input
                    type="number"
                    className={inputCls + ' pl-8 text-base font-bold font-mono'}
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    placeholder="35000000"
                  />
                </div>
                {price > 0 && (
                  <div className="text-xs text-[#5f86ff] mt-1 font-mono">
                    Per sqft rate: ₹{form.sizeSqft && Number(form.sizeSqft) > 0 ? Math.round(price / Number(form.sizeSqft)).toLocaleString('en-IN') : '--'} / sq.ft
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Amenities & Features</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AMENITY_OPTIONS.map((a) => (
                    <label
                      key={a}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
                        form.amenities.includes(a)
                          ? 'border-[#5f86ff] bg-[#5f86ff]/20 text-white'
                          : 'border-white/10 text-[#93a9c7] hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="hidden" />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Rates, Amounts, Interest, Taxes & Underwriting */}
          {activeTab === 3 && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl bg-[#5f86ff]/10 border border-[#5f86ff]/30 text-xs text-[#5f86ff] flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 shrink-0 text-[#5f86ff]" />
                <div>
                  <strong>Admin Presiding Rates & Financial Rails:</strong> Modify interest rates, municipal taxes, maintenance, vacancy, and rent. All investment yields, debt coverage, and underwriting metrics recalculate live below.
                </div>
              </div>

              {/* Input Rails */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Expected Monthly Rent (₹)</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.expectedRent}
                    onChange={(e) => set('expectedRent', e.target.value)}
                    placeholder={price > 0 ? String(Math.round(price * 0.004)) : '45000'}
                  />
                  <span className="text-[10px] text-[#93a9c7]">Market rental yield basis</span>
                </div>
                <div>
                  <label className={labelCls}>Annual Loan Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.05"
                    className={inputCls}
                    value={form.interestRate}
                    onChange={(e) => set('interestRate', e.target.value)}
                    placeholder="8.5"
                  />
                  <span className="text-[10px] text-[#93a9c7]">Benchmark home loan lending rate</span>
                </div>
                <div>
                  <label className={labelCls}>Buyer Down Payment (%)</label>
                  <input
                    type="number"
                    step="1"
                    className={inputCls}
                    value={form.downPaymentPercent}
                    onChange={(e) => set('downPaymentPercent', e.target.value)}
                    placeholder="20"
                  />
                  <span className="text-[10px] text-[#93a9c7]">
                    Equity required: ₹{downPaymentAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div>
                  <label className={labelCls}>Vacancy Reserve Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    className={inputCls}
                    value={form.vacancyRate}
                    onChange={(e) => set('vacancyRate', e.target.value)}
                    placeholder="5"
                  />
                  <span className="text-[10px] text-[#93a9c7]">Default buffer for tenant turnover</span>
                </div>
                <div>
                  <label className={labelCls}>Annual Property Tax Amount (₹)</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.annualPropertyTax}
                    onChange={(e) => set('annualPropertyTax', e.target.value)}
                    placeholder={String(Math.round(price * 0.012))}
                  />
                  <span className="text-[10px] text-[#93a9c7]">Municipal property & urban assessment taxes</span>
                </div>
                <div>
                  <label className={labelCls}>Monthly Maintenance & Society Fee (₹)</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.monthlyMaintenance}
                    onChange={(e) => set('monthlyMaintenance', e.target.value)}
                    placeholder="3500"
                  />
                  <span className="text-[10px] text-[#93a9c7]">Society maintenance, security, clubhouse charges</span>
                </div>
              </div>

              {/* Real-Time Presiding Underwriting Metrics */}
              {price > 0 && (
                <div className="glass-panel p-5 border border-white/15 rounded-xl space-y-3 bg-white/5">
                  <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                    <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-emerald-400" /> Presiding Financial & Ratio Summary
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      Calculated Live
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                      <span className="text-[10px] text-[#93a9c7] block">Monthly Loan EMI</span>
                      <span className="text-sm font-mono font-black text-white">
                        ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                      <span className="text-[10px] text-[#93a9c7] block">Annual Operating Expenses</span>
                      <span className="text-sm font-mono font-black text-amber-300">
                        ₹{totalOperatingExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                      <span className="text-[10px] text-[#93a9c7] block">Net Operating Income (NOI)</span>
                      <span className="text-sm font-mono font-black text-emerald-400">
                        ₹{noi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/yr
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                      <span className="text-[10px] text-[#93a9c7] block">Cap Rate (Capitalization)</span>
                      <span className={`text-sm font-mono font-black ${capRate >= 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {capRate.toFixed(2)}%
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                      <span className="text-[10px] text-[#93a9c7] block">DSCR (Coverage Ratio)</span>
                      <span className={`text-sm font-mono font-black ${dscr >= 1.25 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {dscr.toFixed(2)}x
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                      <span className="text-[10px] text-[#93a9c7] block">Cash-on-Cash Return</span>
                      <span className={`text-sm font-mono font-black ${cashOnCash >= 6 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {cashOnCash.toFixed(2)}%
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                      <span className="text-[10px] text-[#93a9c7] block">Gross Rental Yield</span>
                      <span className="text-sm font-mono font-black text-[#5f86ff]">{grossYield.toFixed(2)}%</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                      <span className="text-[10px] text-[#93a9c7] block">Projected 10-Yr IRR</span>
                      <span className="text-sm font-mono font-black text-purple-300">{projectedIRR.toFixed(2)}%</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                      <span className="text-[10px] text-[#93a9c7] block">Annual Net Cash Flow</span>
                      <span className={`text-sm font-mono font-black ${annualCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ₹{annualCashFlow.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Media & 360 */}
          {activeTab === 4 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">Listing Visual Media</span>
                  <span className="text-[10px] text-[#93a9c7]">Add photo URLs, promotional videos, and 360° virtual tours</span>
                </div>
                <button onClick={addMedia} className="btn-primary text-xs px-3 py-1.5 rounded-lg">
                  + Add Media Item
                </button>
              </div>

              {form.mediaItems.length === 0 && (
                <div className="text-center py-10 text-[#93a9c7] text-sm border border-dashed border-white/20 rounded-xl">
                  No visual media attached. Click "+ Add Media Item" to specify photos or 360° virtual tours.
                </div>
              )}

              {form.mediaItems.map((item, i) => (
                <div key={i} className="flex gap-2 items-start glass-panel p-3.5 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex-1 space-y-2">
                    <input
                      className={inputCls}
                      value={item.mediaUrl}
                      onChange={(e) => updateMedia(i, 'mediaUrl', e.target.value)}
                      placeholder="https://images.unsplash.com/photo-... or https://cdn.pannellum.org/..."
                    />
                    <div className="flex gap-2">
                      <select className={selectCls + ' w-36'} value={item.type} onChange={(e) => updateMedia(i, 'type', e.target.value)}>
                        <option value="image">Photo Image</option>
                        <option value="tour360">360° Virtual Tour</option>
                        <option value="video">Property Video</option>
                      </select>
                      <input
                        className={inputCls + ' flex-1'}
                        value={item.caption}
                        onChange={(e) => updateMedia(i, 'caption', e.target.value)}
                        placeholder="Caption e.g. Master Bedroom Sea View"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeMedia(i)}
                    className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-400 transition-colors shrink-0"
                    title="Remove item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/15 shrink-0 space-y-2 bg-white/5">
          {error && (
            <div className="text-xs text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/30 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-lg">
              {success}
            </div>
          )}
          <div className="flex gap-3 justify-end items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-[#93a9c7] hover:text-white hover:bg-white/10 rounded-lg border border-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg shadow-lg shadow-[#5f86ff]/20 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : isNew ? 'Create & Publish Listing' : 'Save Changes & Rates'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
