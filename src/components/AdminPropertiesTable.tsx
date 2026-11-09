'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, RefreshCw, Eye, CheckCircle, XCircle, Clock, Star, DollarSign, Percent, AlertCircle } from 'lucide-react';
import AdminPropertyEditor from './AdminPropertyEditor';

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function AdminPropertiesTable() {
  const [properties, setProperties] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVerified, setFilterVerified] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Record<string, unknown> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15',
        ...(search && { search }),
        ...(filterType && { type: filterType }),
        ...(filterStatus && { status: filterStatus }),
        ...(filterVerified && { verifiedStatus: filterVerified }),
      });
      const res = await fetch(`/api/admin/properties?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch properties');
      setProperties(data.properties || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: unknown) {
      console.warn('Admin properties table fetch error:', err);
      // Fallback: try fetching from public properties endpoint if admin API had DB issue
      try {
        const fallbackRes = await fetch('/api/properties?limit=50');
        const fallbackData = await fallbackRes.json();
        if (fallbackData.properties && fallbackData.properties.length > 0) {
          setProperties(fallbackData.properties);
          setTotal(fallbackData.properties.length);
          setTotalPages(1);
          return;
        }
      } catch {
        // ignore secondary fallback error
      }
      setError(err instanceof Error ? err.message : 'Failed to load properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterType, filterStatus, filterVerified]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDelete = async (p: Record<string, unknown>) => {
    if (deleteConfirm?.id !== p.id) {
      setDeleteConfirm(p);
      return;
    }
    setDeletingId(String(p.id));
    try {
      const res = await fetch(`/api/admin/properties/${p.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setDeleteConfirm(null);
      setNotification(`Property "${p.title}" was permanently deleted.`);
      setTimeout(() => setNotification(''), 4000);
      fetchProperties();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const openAdd = () => {
    setEditingProperty(null);
    setEditorOpen(true);
  };

  const openEdit = (p: Record<string, unknown>) => {
    setEditingProperty(p);
    setEditorOpen(true);
  };

  const verifiedBadge = (vs: string) => {
    if (vs === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <CheckCircle className="w-2.5 h-2.5" /> Verified
        </span>
      );
    }
    if (vs === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <XCircle className="w-2.5 h-2.5" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
        <Clock className="w-2.5 h-2.5" /> Pending
      </span>
    );
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      available: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      sold: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      rented: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${map[s] || 'bg-white/10 text-white border-white/20'}`}>
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </span>
    );
  };

  const inputCls =
    'bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs placeholder-[#93a9c7] focus:outline-none focus:border-[#5f86ff]/60 transition-colors';

  return (
    <div className="glass-card p-6 border border-white/15 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5f86ff] bg-[#5f86ff]/20 px-2.5 py-1 rounded-full border border-[#5f86ff]/30">
              Admin Master Control
            </span>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Full CRUD Enabled
            </span>
          </div>
          <h3 className="text-lg font-black text-white mt-1 flex items-center gap-2">
            🏢 All Properties & Financial Rates Command Center
          </h3>
          <p className="text-xs text-[#93a9c7]">
            {total} properties total · Add new properties, delete listings, or edit all rates, amounts, interest, taxes, and underwriting metrics.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap shadow-lg shadow-[#5f86ff]/20"
        >
          <Plus className="w-4 h-4" /> Add New Property
        </button>
      </div>

      {notification && (
        <div className="text-xs text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-2 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {notification}
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#93a9c7]" />
          <input
            className={inputCls + ' pl-7 w-full'}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, city, address..."
          />
        </div>
        <select
          className={inputCls}
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Types (Sale & Rent)</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
        <select
          className={inputCls}
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
        </select>
        <select
          className={inputCls}
          value={filterVerified}
          onChange={(e) => {
            setFilterVerified(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Verification Statuses</option>
          <option value="verified">Verified Only</option>
          <option value="pending">Pending Review</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={fetchProperties}
          className="p-1.5 rounded-lg hover:bg-white/10 text-[#93a9c7] hover:text-white border border-white/20 transition-colors"
          title="Refresh List"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {error && (
        <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" /> {error}
        </div>
      )}

      {/* Properties Table */}
      <div className="overflow-x-auto border border-white/10 rounded-xl">
        <table className="w-full text-xs text-left min-w-[850px]">
          <thead className="bg-white/8 text-[#eaf2ff] font-bold border-b border-white/15">
            <tr>
              <th className="p-3">Property</th>
              <th className="p-3">Location</th>
              <th className="p-3">Type</th>
              <th className="p-3">Base Price</th>
              <th className="p-3">Financial Rates</th>
              <th className="p-3">Status</th>
              <th className="p-3">Verification</th>
              <th className="p-3 text-center">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {loading && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#93a9c7]">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#5f86ff]" />
                  Loading properties and underwriting metrics...
                </td>
              </tr>
            )}
            {!loading && properties.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#93a9c7]">
                  No properties found.{' '}
                  <button onClick={openAdd} className="text-[#5f86ff] underline font-bold">
                    Add the first property now
                  </button>
                  .
                </td>
              </tr>
            )}
            {!loading &&
              properties.map((p) => {
                const uw =
                  Array.isArray(p.underwritingReports) && (p.underwritingReports as unknown[]).length > 0
                    ? (p.underwritingReports[0] as Record<string, unknown>)
                    : null;
                const interest = uw ? Number(uw.interestRate || 8.5) : 8.5;
                const cap = uw ? Number(uw.capRate || 0) : 0;

                return (
                  <tr key={String(p.id)} className="hover:bg-white/4 transition-colors group">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {Boolean(p.featured) && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                        <div>
                          <div className="font-bold text-white line-clamp-1 max-w-[170px]">{String(p.title || '')}</div>
                          <div className="text-[#93a9c7] text-[10px]">
                            {String(p.propertyType || '').replace(/_/g, ' ')} · {Number(p.bedrooms || 0)}BR ·{' '}
                            {Number(p.sizeSqft || 0).toLocaleString()} sqft
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#93a9c7]">
                      <div>{String(p.city || '')}</div>
                      <div className="text-[10px] text-white/50">{String(p.state || '')}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          p.type === 'sale'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {p.type === 'sale' ? 'Sale' : 'Rent'}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-[#5f86ff]">{formatINR(Number(p.price || 0))}</td>
                    <td className="p-3">
                      <div className="flex flex-col text-[10px]">
                        <span className="text-white/80 font-mono">Interest: <span className="text-amber-400 font-bold">{interest}%</span></span>
                        <span className="text-emerald-400 font-mono">Cap Rate: <span className="font-bold">{cap > 0 ? `${cap.toFixed(1)}%` : 'Auto'}</span></span>
                      </div>
                    </td>
                    <td className="p-3">{statusBadge(String(p.status || 'available'))}</td>
                    <td className="p-3">{verifiedBadge(String(p.verifiedStatus || 'pending'))}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <a
                          href={`/properties/${p.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg hover:bg-white/10 text-[#93a9c7] hover:text-white transition-colors"
                          title="View live listing"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEdit(p)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#5f86ff]/20 text-[#5f86ff] hover:bg-[#5f86ff]/30 font-bold text-[11px] transition-colors border border-[#5f86ff]/30"
                          title="Edit property details, rates, interest & taxes"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={deletingId === String(p.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            deleteConfirm?.id === p.id
                              ? 'bg-rose-500 text-white animate-pulse'
                              : 'hover:bg-rose-500/20 text-[#93a9c7] hover:text-rose-400'
                          }`}
                          title={deleteConfirm?.id === p.id ? 'Click again to confirm delete' : 'Delete property'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {deleteConfirm?.id === p.id && (
                        <div className="text-[10px] text-rose-400 text-center mt-1 font-bold">
                          ⚠️ Click 🗑 again to confirm!
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#93a9c7]">
            Page {page} of {totalPages} · {total} properties
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#93a9c7] hover:text-white disabled:opacity-40 border border-white/20 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#93a9c7] hover:text-white disabled:opacity-40 border border-white/20 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Property Editor Modal */}
      {editorOpen && (
        <AdminPropertyEditor
          property={editingProperty}
          onClose={() => {
            setEditorOpen(false);
            setDeleteConfirm(null);
          }}
          onSaved={fetchProperties}
        />
      )}
    </div>
  );
}
