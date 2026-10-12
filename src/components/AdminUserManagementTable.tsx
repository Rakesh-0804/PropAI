'use client';

import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Search, CheckCircle2, AlertCircle, Filter, RefreshCw } from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  verifiedStatus: string;
  avatar?: string;
  createdAt: string;
}

export default function AdminUserManagementTable() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        setMessage({ type: 'success', text: `Updated user role to "${newRole}" successfully.` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update role' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error updating user role' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerificationToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'verified' ? 'pending' : 'verified';
    setUpdatingId(userId);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, verifiedStatus: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, verifiedStatus: newStatus } : u)));
        setMessage({ type: 'success', text: `User status changed to ${newStatus.toUpperCase()}.` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update status' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error updating status' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-6 text-[#eaf2ff]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#5f86ff] font-extrabold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Admin Access Controller
          </div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#5f86ff]" /> Platform User Access & Role Management
          </h2>
        </div>

        <button
          onClick={fetchUsers}
          className="chip chip-active text-xs font-bold gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Accounts
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          {message.text}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#93a9c7] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-9 pr-3 py-2 text-white font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#93a9c7]" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-900/80 border border-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-[#5f86ff]"
          >
            <option value="all" className="bg-slate-900 text-white">All Roles ({users.length})</option>
            <option value="buyer" className="bg-slate-900 text-white">Buyers ({users.filter((u) => u.role === 'buyer').length})</option>
            <option value="seller" className="bg-slate-900 text-white">Sellers ({users.filter((u) => u.role === 'seller').length})</option>
            <option value="agent" className="bg-slate-900 text-white">Agents ({users.filter((u) => u.role === 'agent').length})</option>
            <option value="admin" className="bg-slate-900 text-white">Admins ({users.filter((u) => u.role === 'admin').length})</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto border border-white/15 rounded-xl glass">
        <table className="w-full text-xs text-left">
          <thead className="bg-white/10 text-[#eaf2ff] font-bold border-b border-white/15">
            <tr>
              <th className="p-3">User Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Current Role</th>
              <th className="p-3">Account Status</th>
              <th className="p-3">Role Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-[#93a9c7] font-medium">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#93a9c7]">
                  Loading user records...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#93a9c7]">
                  No users found matching search filter.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30 font-extrabold flex items-center justify-center text-xs shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>

                  <td className="p-3 text-[#93a9c7] font-mono">{user.email}</td>
                  <td className="p-3 text-[#93a9c7]">{user.phone || 'N/A'}</td>

                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : user.role === 'seller' || user.role === 'agent'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-[#5f86ff]/20 text-[#5f86ff] border border-[#5f86ff]/30'
                      }`}
                    >
                      {user.role === 'admin' ? '👑 Admin' : user.role === 'seller' ? '🏡 Seller' : user.role === 'agent' ? '👔 Agent' : '👤 Buyer'}
                    </span>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleVerificationToggle(user.id, user.verifiedStatus)}
                      disabled={updatingId === user.id}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                        user.verifiedStatus === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                      }`}
                    >
                      {user.verifiedStatus === 'verified' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Active
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 text-amber-400" /> Pending Approval
                        </>
                      )}
                    </button>
                  </td>

                  <td className="p-3">
                    <select
                      value={user.role}
                      disabled={updatingId === user.id}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-slate-900/80 border border-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-lg focus:outline-none focus:border-[#5f86ff]"
                    >
                      <option value="buyer" className="bg-slate-900 text-white">Set as Buyer</option>
                      <option value="seller" className="bg-slate-900 text-white">Set as Seller</option>
                      <option value="agent" className="bg-slate-900 text-white">Set as Agent</option>
                      <option value="admin" className="bg-slate-900 text-white">Set as Admin (Full Access)</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
