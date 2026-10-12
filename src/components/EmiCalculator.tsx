'use client';

import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, Calendar, TrendingUp, ShieldCheck, PieChart, ArrowUpRight, AlertCircle } from 'lucide-react';
import { formatINR } from '@/types';

interface EmiCalculatorProps {
  propertyPrice: number;
}

export default function EmiCalculator({ propertyPrice }: EmiCalculatorProps) {
  const safePropertyPrice = Math.max(100000, Number(propertyPrice) || 100000);

  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [expectedRent, setExpectedRent] = useState<number>(Math.round(safePropertyPrice * 0.0035));

  // Clamped input values
  const validDownPaymentPct = Math.min(90, Math.max(0, Number(downPaymentPercent) || 0));
  const validInterestRate = Math.min(30, Math.max(0, Number(interestRate) || 0));
  const validTenureYears = Math.min(30, Math.max(1, Number(tenureYears) || 20));
  const validExpectedRent = Math.max(0, Number(expectedRent) || 0);

  // Calculations
  const downPayment = Math.round((safePropertyPrice * validDownPaymentPct) / 100);
  const principal = Math.max(0, safePropertyPrice - downPayment);
  const monthlyRate = (validInterestRate / 100) / 12;
  const totalMonths = validTenureYears * 12;

  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  let emi = 0;
  if (principal > 0) {
    if (monthlyRate <= 0) {
      emi = Math.round(principal / totalMonths);
    } else {
      const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
      emi = Math.round(
        (principal * monthlyRate * compoundFactor) / (compoundFactor - 1)
      );
    }
  }

  const totalPayment = Math.round(emi * totalMonths);
  const totalInterest = Math.max(0, totalPayment - principal);

  // Financial Ratios
  const ltvRatio = Number(((principal / safePropertyPrice) * 100).toFixed(1)); // Loan to Value %
  const grossRentalYield = Number((((validExpectedRent * 12) / safePropertyPrice) * 100).toFixed(2)); // Gross Yield %
  const netRentalYield = Number((((validExpectedRent * 12 * 0.85) / safePropertyPrice) * 100).toFixed(2)); // Net Yield % after 15% expenses
  const netMonthlyCashFlow = Math.round(validExpectedRent - emi);
  const dscr = emi > 0 ? Number((validExpectedRent / emi).toFixed(2)) : 9.99; // Debt Service Coverage Ratio
  const interestOverheadPercent = principal > 0 ? Number(((totalInterest / principal) * 100).toFixed(1)) : 0;

  return (
    <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-6 text-[#eaf2ff] rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/15 pb-4">
        <div className="flex items-center gap-2.5 text-white font-bold text-base">
          <div className="p-2 bg.purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl">
            <Calculator className="w-5 h-5 text-purple-400" />
          </div>
          Comprehensive Home Loan & EMI Calculator (₹)
        </div>
        <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full font-bold">
          Precision Financial Engine
        </span>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-[#93a9c7]">
        {/* Down Payment */}
        <div>
          <label className="block mb-1 text-[#eaf2ff]">Down Payment ({validDownPaymentPct}%)</label>
          <div className="relative">
            <input
              type="number"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full pl-3 pr-8 py-2 glass-input text-white font-medium"
              min="0"
              max="90"
            />
            <Percent className="w-4 h-4 text-[#93a9c7] absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <p className="text-[10px] text-emerald-400 font-mono mt-1 font-bold">{formatINR(downPayment)}</p>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block mb-1 text-[#eaf2ff]">Interest Rate (% p.a.)</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full pl-3 pr-8 py-2 glass-input text-white font-medium"
              min="0"
              max="30"
            />
            <Percent className="w-4 h-4 text-[#93a9c7] absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Loan Tenure */}
        <div>
          <label className="block mb-1 text-[#eaf2ff]">Loan Tenure (Years)</label>
          <select
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-900/80 border border-white/20 text-white rounded-xl focus:outline-none focus:border-[#5f86ff] font-medium"
          >
            <option value="5" className="bg-slate-900 text-white">5 Years</option>
            <option value="10" className="bg-slate-900 text-white">10 Years</option>
            <option value="15" className="bg-slate-900 text-white">15 Years</option>
            <option value="20" className="bg-slate-900 text-white">20 Years (Standard)</option>
            <option value="25" className="bg-slate-900 text-white">25 Years</option>
            <option value="30" className="bg-slate-900 text-white">30 Years</option>
          </select>
        </div>

        {/* Expected Rent */}
        <div>
          <label className="block mb-1 text-[#eaf2ff]">Est. Monthly Rent (₹)</label>
          <div className="relative">
            <input
              type="number"
              value={expectedRent}
              onChange={(e) => setExpectedRent(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-2 glass-input text-white font-medium"
            />
            <span className="w-4 h-4 text-[#93a9c7] absolute left-2 top-1/2 -translate-y-1/2 font-bold">₹</span>
          </div>
        </div>
      </div>

      {/* Primary Output EMI Card */}
      <div className="p-5 bg-gradient-to-br from-purple-900/60 via-indigo-900/60 to-slate-900/80 border border-purple-500/30 text-white rounded-2xl space-y-4 shadow-xl">
        <div className="flex justify-between items-baseline border-b border-purple-500/30 pb-3">
          <div>
            <span className="text-xs text-purple-200 font-medium block">Estimated Monthly Payment (EMI)</span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#5f86ff] font-mono">
              {formatINR(emi)}/mo
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-purple-200 uppercase font-bold block">Loan to Value (LTV)</span>
            <span className={`text-lg font-black font-mono ${ltvRatio <= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {ltvRatio}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
            <span className="text-[#93a9c7] block text-[10px] uppercase font-bold">Loan Principal</span>
            <span className="font-bold text-white font-mono">{formatINR(principal)}</span>
          </div>
          <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
            <span className="text-[#93a9c7] block text-[10px] uppercase font-bold">Total Interest Paid</span>
            <span className="font-bold text-amber-300 font-mono">{formatINR(totalInterest)}</span>
            <span className="text-[9px] text-[#93a9c7] block">({interestOverheadPercent}% of principal)</span>
          </div>
          <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[#93a9c7] block text-[10px] uppercase font-bold">Total Outflow</span>
            <span className="font-bold text-white font-mono">{formatINR(totalPayment)}</span>
          </div>
        </div>

        {/* Investment Ratio Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-purple-500/30 text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#93a9c7] uppercase font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" /> Gross Rental Yield
            </span>
            <span className="font-extrabold text-emerald-300 font-mono text-sm">{grossRentalYield}% p.a.</span>
            <span className="text-[9px] text-[#93a9c7]">Net Yield: {netRentalYield}%</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-[#93a9c7] uppercase font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" /> Rent Coverage (DSCR)
            </span>
            <span className={`font-extrabold font-mono text-sm ${dscr >= 1.25 ? 'text-emerald-400' : dscr >= 1.0 ? 'text-amber-400' : 'text-rose-400'}`}>
              {dscr}x
            </span>
            <span className="text-[9px] text-[#93a9c7]">{dscr >= 1.25 ? 'Lender Standard OK' : 'Underwriting Caution'}</span>
          </div>

          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#93a9c7] uppercase font-bold flex items-center gap-1">
              <PieChart className="w-3 h-3 text-[#5f86ff]" /> Monthly Cash Flow
            </span>
            <span className={`font-extrabold font-mono text-sm ${netMonthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netMonthlyCashFlow >= 0 ? `+${formatINR(netMonthlyCashFlow)}` : `-${formatINR(Math.abs(netMonthlyCashFlow))}`}
            </span>
            <span className="text-[9px] text-[#93a9c7]">Rent minus Monthly EMI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
