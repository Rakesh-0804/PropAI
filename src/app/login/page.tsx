'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Building2, LogIn, Lock, Mail, Sparkles, ShieldCheck, MapPin, Calculator, Loader2, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const doLogin = async (loginEmail: string, loginPass: string, roleName?: string) => {
    setError('');
    setLoading(true);
    if (roleName) setActiveRole(roleName);

    try {
      const res = await login(loginEmail, loginPass);

      if (res.success) {
        const targetUrl =
          redirectParam ||
          res.redirectTo ||
          (res.user?.role === 'admin'
            ? '/dashboard/admin'
            : res.user?.role === 'seller' || res.user?.role === 'agent'
            ? '/dashboard/seller'
            : '/dashboard/buyer');

        setSuccessMsg(`Welcome, ${res.user?.name || 'User'}! Opening ${targetUrl}...`);

        // Instant client-side redirect
        router.push(targetUrl);
        router.refresh();

        // Safety fallback if router.push needs a kick
        setTimeout(() => {
          if (window.location.pathname !== targetUrl) {
            window.location.href = targetUrl;
          }
        }, 300);
      } else {
        setError(res.error || 'Invalid credentials');
        setLoading(false);
        setActiveRole(null);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
      setActiveRole(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doLogin(email, password);
  };

  const fillDemoCredentials = (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setActiveRole(roleName);
    setError('');
    setSuccessMsg(`Loaded ${roleName.toUpperCase()} credentials into form. Click "Sign In" to continue.`);
  };

  return (
    <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/15 shadow-2xl space-y-6">
      {/* Header Icon & Title */}
      <div className="text-center space-y-2">
        <div className="inline-block p-3.5 bg-[#5f86ff]/20 text-[#5f86ff] rounded-2xl border border-[#5f86ff]/30 shadow-md mb-1">
          <Building2 className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Sign In to PropAI</h2>
        <p className="text-xs text-[#93a9c7]">Access your property dashboard, visits, and saved alerts</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/30 text-center animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-500/30 text-center flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-[#93a9c7]">
        <div>
          <label className="block mb-1 text-[#93a9c7]">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full glass-input pl-12 pr-4 py-3 text-white font-medium disabled:opacity-50"
            />
            <Mail className="w-4 h-4 text-[#93a9c7] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-[#93a9c7]">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full glass-input pl-12 pr-4 py-3 text-white font-medium disabled:opacity-50"
            />
            <Lock className="w-4 h-4 text-[#93a9c7] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3.5 text-sm font-bold shadow-lg gap-2 cursor-pointer flex items-center justify-center disabled:opacity-75"
        >
          {loading && !activeRole ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      {/* Auto-Fill Demo Credentials */}
      <div className="border-t border-white/15 pt-4 space-y-3">
        <span className="text-[11px] font-extrabold text-[#eaf2ff] uppercase tracking-wider block text-center">
          ⚡ AUTO-FILL DEMO CREDENTIALS
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => fillDemoCredentials('admin@example.com', 'admin')}
            className={`p-3 rounded-xl border text-center transition-all group cursor-pointer disabled:opacity-70 ${
              activeRole === 'admin'
                ? 'bg-purple-600/30 text-white border-purple-400 ring-2 ring-purple-500/50 scale-102'
                : 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30 text-purple-200'
            }`}
          >
            <span className="font-extrabold text-[11px] block group-hover:text-white">👑 Admin</span>
            <span className="text-[9px] text-purple-300 block mt-0.5 font-mono">Fill Admin</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => fillDemoCredentials('seller@example.com', 'seller')}
            className={`p-3 rounded-xl border text-center transition-all group cursor-pointer disabled:opacity-70 ${
              activeRole === 'seller'
                ? 'bg-emerald-600/30 text-white border-emerald-400 ring-2 ring-emerald-500/50 scale-102'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/30 text-emerald-200'
            }`}
          >
            <span className="font-extrabold text-[11px] block group-hover:text-white">🏡 Seller</span>
            <span className="text-[9px] text-emerald-300 block mt-0.5 font-mono">Fill Seller</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => fillDemoCredentials('buyer@example.com', 'buyer')}
            className={`p-3 rounded-xl border text-center transition-all group cursor-pointer disabled:opacity-70 ${
              activeRole === 'buyer'
                ? 'bg-[#5f86ff]/30 text-white border-blue-400 ring-2 ring-blue-500/50 scale-102'
                : 'bg-[#5f86ff]/20 hover:bg-[#5f86ff]/30 border-[#5f86ff]/30 text-blue-200'
            }`}
          >
            <span className="font-extrabold text-[11px] block group-hover:text-white">👤 Buyer</span>
            <span className="text-[9px] text-[#5f86ff] block mt-0.5 font-mono">Fill Buyer</span>
          </button>
        </div>
        <p className="text-[10px] text-[#93a9c7] text-center">
          Click any role above to put the email and password into the text boxes, then click &ldquo;Sign In&rdquo; when ready.
        </p>
      </div>

      {/* Sign Up Link for New Users */}
      <p className="text-center text-xs text-[#93a9c7] font-medium pt-3 border-t border-white/15">
        New to PropAI?{' '}
        <Link href="/signup" className="text-[#5f86ff] font-bold hover:underline transition-colors">
          Create an Account / Sign Up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 text-[#eaf2ff]">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Side: Direct Brand & AI Features Section */}
        <div className="space-y-6 text-[#eaf2ff] pr-0 lg:pr-4">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#5f86ff] flex items-center justify-center text-white shadow-lg shadow-[#5f86ff]/30 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">PropAI Estate</h1>
              <span className="text-[10px] font-black text-[#5f86ff] tracking-widest uppercase block">
                NEXT-GEN REAL ESTATE AI
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#93a9c7] leading-relaxed max-w-md">
            AI-Powered Real Estate Platform connecting buyers, sellers, agents, and admins with automated valuation, match scores, 360° virtual tours, and fake listing protection.
          </p>

          {/* Explore / AI Features Section */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#5f86ff] tracking-widest uppercase block">
                EXPLORE
              </span>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> AI Features & Capabilities
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-400/20 text-amber-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Smart Price Estimation</h4>
                  <p className="text-[11px] text-[#93a9c7]">Automated market valuation & investment yield confidence range</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-400/20 text-emerald-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Duplicate & Fraud Detection</h4>
                  <p className="text-[11px] text-[#93a9c7]">Perceptual hashing & fake listing review protection</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-sky-400/20 text-sky-400 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Nearby Places Analysis</h4>
                  <p className="text-[11px] text-[#93a9c7]">Transit score, schools, hospitals & neighborhood livability</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-purple-400/20 text-purple-400 shrink-0 mt-0.5">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">EMI & ROI Calculator</h4>
                  <p className="text-[11px] text-[#93a9c7]">Loan repayment schedule & 10-year growth forecasting</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-[#93a9c7] flex justify-between items-center font-medium">
            <span>● 100% Verified Platform Data</span>
            <span className="text-emerald-400 font-mono font-bold">Systems Operational</span>
          </div>
        </div>

        {/* Right Side: The Main Dark Glass Card Tile with Suspense */}
        <Suspense fallback={
          <div className="glass-card p-10 rounded-3xl border border-white/15 text-center text-[#93a9c7]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#5f86ff]" />
            Loading authentication portal...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
