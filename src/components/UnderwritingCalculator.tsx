'use client';

import React, { useState, useEffect } from 'react';
import { UnderwritingReportData, CashFlowYear, formatINR } from '@/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  FileText,
  Download,
  Building2,
  Percent,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface UnderwritingCalculatorProps {
  propertyId: string;
  initialReport?: UnderwritingReportData | null;
  defaultPrice?: number;
}

export default function UnderwritingCalculator({
  propertyId,
  initialReport,
  defaultPrice = 15000000,
}: UnderwritingCalculatorProps) {
  const [report, setReport] = useState<UnderwritingReportData | null>(initialReport || null);
  const [loading, setLoading] = useState(!initialReport);
  const [calculating, setCalculating] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Form Inputs
  const [price, setPrice] = useState<number>(initialReport?.purchasePrice || defaultPrice);
  const [expectedRent, setExpectedRent] = useState<number>(initialReport?.expectedRent || Math.round(defaultPrice * 0.0035));
  const [downPaymentPct, setDownPaymentPct] = useState<number>(initialReport?.downPaymentPercent || 20);
  const [interestRate, setInterestRate] = useState<number>(initialReport?.interestRate || 8.5);
  const [vacancyRate, setVacancyRate] = useState<number>(initialReport?.vacancyRate || 5.0);

  useEffect(() => {
    if (!initialReport) {
      fetchReport();
    }
  }, [propertyId]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/underwriting?propertyId=${propertyId}`);
      const json = await res.json();
      if (res.ok && json.report) {
        setReport(json.report);
        setPrice(json.report.purchasePrice);
        setExpectedRent(json.report.expectedRent);
        setDownPaymentPct(json.report.downPaymentPercent);
        setInterestRate(json.report.interestRate);
        setVacancyRate(json.report.vacancyRate);
      }
    } catch (err) {
      console.error('Failed to fetch underwriting report', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCalculating(true);
    try {
      const res = await fetch('/api/ai/underwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          purchasePrice: price,
          expectedRent,
          downPaymentPercent: downPaymentPct,
          interestRate,
          vacancyRate,
        }),
      });
      const json = await res.json();
      if (res.ok && json.report) {
        setReport(json.report);
      }
    } catch (err) {
      console.error('Failed to update underwriting', err);
    } finally {
      setCalculating(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const res = await fetch('/api/ai/underwriting/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      });
      const json = await res.json();
      if (res.ok && json.html) {
        // Open printable window for PDF download
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(json.html);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
          }, 500);
        }
      }
    } catch (err) {
      console.error('Failed to generate PDF report', err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-12 text-center space-y-4 shadow-xl border border-white/15 text-[#eaf2ff]">
        <Calculator className="w-8 h-8 text-[#5f86ff] animate-pulse mx-auto" />
        <p className="font-semibold text-white">Calculating Underwriting & Investment Metrics...</p>
        <p className="text-sm text-[#93a9c7]">Aggregating public tax records, historical sales, and macro financial projections.</p>
      </div>
    );
  }

  const projections = report?.projections || [];

  return (
    <div className="glass-card p-6 shadow-2xl border border-white/15 space-y-8 text-[#eaf2ff]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Automated Financial Underwriting
            </span>
            <span className="text-xs text-[#93a9c7] font-medium">Lender & Investor Standard</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-[#5f86ff]" /> Property Valuation & Underwriting Microservice
          </h2>
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={downloadingPdf}
          className="btn-primary py-2.5 px-5 text-xs font-bold shadow-lg flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {downloadingPdf ? 'Generating PDF...' : 'Download PDF Underwriting Report'}
        </button>
      </div>

      {/* KPI Cards Grid */}
      {report && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass-panel p-4 rounded-xl shadow-md border border-white/10">
            <span className="text-[11px] font-bold text-[#93a9c7] uppercase tracking-wider block">Net Operating Income (NOI)</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{formatINR(report.noi)}</div>
            <span className="text-[10px] text-[#93a9c7] mt-1 block">Annual Yield After Expenses</span>
          </div>

          <div className="glass-panel p-4 rounded-xl shadow-md border border-white/10">
            <span className="text-[11px] font-bold text-[#93a9c7] uppercase tracking-wider block">Cap Rate</span>
            <div className="text-2xl font-black text-[#5f86ff] mt-1">{report.capRate}%</div>
            <span className="text-[10px] text-emerald-400 mt-1 block flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> Fair Market Yield
            </span>
          </div>

          <div className="glass-panel p-4 rounded-xl shadow-md border border-white/10">
            <span className="text-[11px] font-bold text-[#93a9c7] uppercase tracking-wider block">Debt Coverage (DSCR)</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{report.dscr}x</div>
            <span className="text-[10px] text-[#93a9c7] mt-1 block">Target: &gt; 1.25x</span>
          </div>

          <div className="glass-panel p-4 rounded-xl shadow-md border border-white/10">
            <span className="text-[11px] font-bold text-[#93a9c7] uppercase tracking-wider block">Cash-on-Cash</span>
            <div className="text-2xl font-black text-purple-400 mt-1">{report.cashOnCashReturn}%</div>
            <span className="text-[10px] text-[#93a9c7] mt-1 block">Year 1 Cash Yield</span>
          </div>

          <div className="glass-panel p-4 rounded-xl shadow-md border border-white/10 col-span-2 lg:col-span-1">
            <span className="text-[11px] font-bold text-[#93a9c7] uppercase tracking-wider block">10-Yr Est. IRR</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">{report.irr}%</div>
            <span className="text-[10px] text-[#93a9c7] mt-1 block">Internal Rate of Return</span>
          </div>
        </div>
      )}

      {/* Interactive Parameter Controls & Recharts Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Underwriting Parameter Controls Form */}
        <form onSubmit={handleRecalculate} className="lg:col-span-4 glass-panel p-5 rounded-xl border border-white/15 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-[#5f86ff]" /> Investment Parameters
          </h3>

          <div className="space-y-3 text-xs font-semibold text-[#93a9c7]">
            <div>
              <label className="text-[#eaf2ff] block mb-1">Purchase / Valuation Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full glass-input text-white font-medium"
              />
            </div>

            <div>
              <label className="text-[#eaf2ff] block mb-1">Expected Monthly Rent (₹)</label>
              <input
                type="number"
                value={expectedRent}
                onChange={(e) => setExpectedRent(Number(e.target.value))}
                className="w-full glass-input text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[#eaf2ff] block mb-1">Down Payment (%)</label>
                <input
                  type="number"
                  step="1"
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full glass-input text-white font-medium"
                />
              </div>

              <div>
                <label className="text-[#eaf2ff] block mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full glass-input text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[#eaf2ff] block mb-1">Vacancy Allowance (%)</label>
              <input
                type="number"
                step="0.5"
                value={vacancyRate}
                onChange={(e) => setVacancyRate(Number(e.target.value))}
                className="w-full glass-input text-white font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={calculating}
            className="w-full py-2.5 rounded-xl text-xs font-bold btn-primary shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {calculating ? 'Updating Model...' : 'Re-Calculate Underwriting'}
          </button>
        </form>

        {/* 10-Year Cash Flow Projection Chart */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-xl border border-white/15 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> 10-Year Cash Flow & Equity Projections
            </h3>
            <span className="text-xs text-[#93a9c7] font-mono">Assumes 3.5% Rent Growth / 4.0% Appreciation</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projections}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" tickFormatter={(y) => `Yr ${y}`} stroke="#93a9c7" fontSize={11} />
                <YAxis stroke="#93a9c7" fontSize={11} tickFormatter={(v) => formatINR(v, true)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#030a14', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '12px' }}
                  formatter={(value: any) => [formatINR(Number(value)), '']}
                  labelFormatter={(y) => `Year ${y} Projection`}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#eaf2ff' }} />
                <Bar dataKey="grossRent" name="Gross Rent" fill="#5f86ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="operatingExpenses" name="Operating Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="netCashFlow" name="Net Cash Flow" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Public Tax Records & Macro Economic Trends */}
      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-white/15 pt-6">
          {/* Public Tax Records History */}
          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#5f86ff]" /> Aggregated Public Tax Records (5-Year History)
            </h4>
            <div className="overflow-x-auto border border-white/15 rounded-xl glass">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/10 font-bold text-[#eaf2ff] border-b border-white/15">
                  <tr>
                    <th className="p-2.5">Tax Year</th>
                    <th className="p-2.5">Assessed Value</th>
                    <th className="p-2.5">Land Value</th>
                    <th className="p-2.5">Building Value</th>
                    <th className="p-2.5">Tax Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 font-medium text-[#93a9c7]">
                  {report.taxHistory.map((t) => (
                    <tr key={t.year} className="hover:bg-white/5 transition-colors">
                      <td className="p-2.5 font-bold text-white">{t.year}</td>
                      <td className="p-2.5 text-[#eaf2ff]">{formatINR(t.assessedValue)}</td>
                      <td className="p-2.5 text-[#93a9c7]">{formatINR(t.landValue)}</td>
                      <td className="p-2.5 text-[#93a9c7]">{formatINR(t.buildingValue)}</td>
                      <td className="p-2.5 font-semibold text-emerald-400">{formatINR(t.taxPaid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Macro Economic Trends */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-purple-400" /> Macro Economic Market Index
            </h4>
            <div className="glass-panel text-white p-4 rounded-xl border border-white/15 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-white/15 pb-2">
                <span className="text-[#93a9c7]">Market Sentiment</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {report.macroTrends.marketSentiment}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#93a9c7]">Area Annual Growth Rate</span>
                <span className="font-mono text-white font-bold">{report.macroTrends.areaGrowthRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#93a9c7]">Rental Yield Index</span>
                <span className="font-mono text-[#5f86ff] font-bold">{report.macroTrends.rentalYieldIndex}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#93a9c7]">Inflation Index Benchmark</span>
                <span className="font-mono text-amber-400 font-bold">{report.macroTrends.inflationRate}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
