'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Building2, UserPlus, Lock, Mail, Phone, User } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [role, setRole] = useState<'buyer' | 'seller' | 'agent'>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signup({ name, email, password, phone, role });
    setLoading(false);

    if (res.success) {
      router.push('/properties');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 text-[#eaf2ff]">
      <div className="w-full max-w-md glass-card p-8 space-y-6 border border-white/15 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block p-3 bg-[#5f86ff]/20 text-[#5f86ff] rounded-2xl mb-1 border border-[#5f86ff]/30">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create Account</h1>
          <p className="text-xs text-[#93a9c7]">Join the PropAI platform as a Buyer, Seller, or Agent</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 glass p-1 text-xs font-semibold border border-white/15">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2 rounded-lg transition-all capitalize cursor-pointer ${
              role === 'buyer' ? 'bg-[#5f86ff] text-white font-bold shadow-md' : 'text-[#93a9c7] hover:text-white'
            }`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`py-2 rounded-lg transition-all capitalize cursor-pointer ${
              role === 'seller' ? 'bg-[#5f86ff] text-white font-bold shadow-md' : 'text-[#93a9c7] hover:text-white'
            }`}
          >
            Seller
          </button>
          <button
            type="button"
            onClick={() => setRole('agent')}
            className={`py-2 rounded-lg transition-all capitalize cursor-pointer ${
              role === 'agent' ? 'bg-[#5f86ff] text-white font-bold shadow-md' : 'text-[#93a9c7] hover:text-white'
            }`}
          >
            Agent
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/30 text-center">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-[#93a9c7]">
          <div>
            <label className="block mb-1 text-[#93a9c7]">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input pl-12 pr-4 py-2.5 text-white font-medium"
              />
              <User className="w-4 h-4 text-[#93a9c7] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[#93a9c7]">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-12 pr-4 py-2.5 text-white font-medium"
              />
              <Mail className="w-4 h-4 text-[#93a9c7] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[#93a9c7]">Phone Number (Optional)</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full glass-input pl-12 pr-4 py-2.5 text-white font-medium"
              />
              <Phone className="w-4 h-4 text-[#93a9c7] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[#93a9c7]">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-12 pr-4 py-2.5 text-white font-medium"
              />
              <Lock className="w-4 h-4 text-[#93a9c7] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-sm font-bold shadow-lg gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-[#93a9c7] font-medium pt-2 border-t border-white/15">
          Already have an account?{' '}
          <Link href="/login" className="text-[#5f86ff] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
