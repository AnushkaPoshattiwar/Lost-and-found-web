'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  RotateCcw, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  Tag, 
  MapPin, 
  Calendar,
  Layers,
  Inbox,
  Filter,
  Lock,
  Unlock,
  Mail,
  Phone,
  ShieldCheck,
  Eye,
  X,
  Sparkles
} from 'lucide-react';
import { Item, ItemStatus } from '@/types';
import { 
  getItems, 
  updateItemStatus, 
  updateItemVerification, 
  deleteItem, 
  resetSeedData,
  findPotentialMatches
} from '@/lib/itemsStore';

export default function AdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [privacyFilter, setPrivacyFilter] = useState('all'); // 'all' | 'public' | 'private'
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Modal view for inspecting private or sensitive report details
  const [inspectItem, setInspectItem] = useState<Item | null>(null);
  const [aiMatches, setAiMatches] = useState<Array<{ match: Item; confidenceScore: number; matchReasons: string[] }>>([]);

  const loadAllItems = async () => {
    setLoading(true);
    try {
      // Admin query requests ALL items, including private reports
      const data = await getItems({ includePrivate: true });
      setItems(data);
    } catch (err) {
      console.error('Failed to load items in admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllItems();
  }, []);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleToggleStatus = async (item: Item) => {
    const nextStatus: ItemStatus = item.status === 'resolved' ? 'active' : 'resolved';
    setActionLoading(item.id);
    try {
      await updateItemStatus(item.id, nextStatus);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
      );
      if (inspectItem?.id === item.id) {
        setInspectItem({ ...inspectItem, status: nextStatus });
      }
      showFeedback(`Updated "${item.title}" to ${nextStatus}.`);
    } catch (err) {
      console.error(err);
      showFeedback('Failed to update status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVerification = async (item: Item) => {
    const nextVerified = !item.is_verified;
    setActionLoading(item.id);
    try {
      await updateItemVerification(item.id, nextVerified);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_verified: nextVerified } : i))
      );
      if (inspectItem?.id === item.id) {
        setInspectItem({ ...inspectItem, is_verified: nextVerified });
      }
      showFeedback(
        nextVerified 
          ? `Verified "${item.title}" with campus security.` 
          : `Marked "${item.title}" unverified.`
      );
    } catch (err) {
      console.error(err);
      showFeedback('Failed to update verification status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the report for "${title}"?`)) {
      return;
    }
    setActionLoading(id);
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (inspectItem?.id === id) setInspectItem(null);
      showFeedback(`Deleted "${title}".`);
    } catch (err) {
      console.error(err);
      showFeedback('Failed to delete item.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleInspect = async (item: Item) => {
    setInspectItem(item);
    try {
      const matches = await findPotentialMatches(item, { isAdmin: true });
      setAiMatches(matches);
    } catch (err) {
      console.error('AI match lookup error:', err);
      setAiMatches([]);
    }
  };

  const handleResetSeed = () => {
    if (window.confirm('Reset all items back to initial demo campus dataset (including sensitive private items)?')) {
      resetSeedData();
      loadAllItems();
      showFeedback('Demo data successfully reseeded.');
    }
  };

  // Filtered items for display
  const filtered = items.filter((item) => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (privacyFilter === 'private' && !item.is_private) return false;
    if (privacyFilter === 'public' && item.is_private) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.contact_name.toLowerCase().includes(q) ||
        item.contact_email.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate summary metrics
  const totalCount = items.length;
  const activeLost = items.filter((i) => i.type === 'lost' && i.status === 'active').length;
  const activeFound = items.filter((i) => i.type === 'found' && i.status === 'active').length;
  const privateCount = items.filter((i) => i.is_private).length;
  const resolvedCount = items.filter((i) => i.status === 'resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
            Staff & Security Moderation Panel
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Reports Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review submitted items, assist sensitive private item returns, verify property claims, or remove spam.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetSeed}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-sm"
            title="Reset to default seed items"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total Reports</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-slate-400">All submissions</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
          <div className="text-[11px] font-bold text-rose-600 uppercase">Active Lost</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{activeLost}</div>
          <div className="text-[11px] text-rose-400">Awaiting return</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="text-[11px] font-bold text-emerald-600 uppercase">Active Found</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{activeFound}</div>
          <div className="text-[11px] text-emerald-400">In campus possession</div>
        </div>

        {/* Private / Sensitive Reports metric */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm bg-gradient-to-br from-white to-amber-50/40">
          <div className="text-[11px] font-bold text-amber-800 uppercase flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-600" />
            Private / Sensitive
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">{privateCount}</div>
          <div className="text-[11px] text-amber-600/80 font-medium">Hidden from public</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold text-blue-600 uppercase">Resolved</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{resolvedCount}</div>
          <div className="text-[11px] text-blue-400">Returned to owners</div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search report title, description, reporter, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Privacy Filter */}
          <select
            value={privacyFilter}
            onChange={(e) => setPrivacyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-amber-300 text-xs sm:text-sm font-semibold text-amber-900 bg-amber-50/50"
          >
            <option value="all">🔒 All Privacy Modes</option>
            <option value="private">🔒 Private / Sensitive Only</option>
            <option value="public">🔓 Public Only</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 bg-white"
          >
            <option value="all">All Types</option>
            <option value="lost">Lost Only</option>
            <option value="found">Found Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="resolved">Resolved Only</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 divide-y divide-slate-200">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Item Report</th>
                <th className="px-4 py-3.5">Privacy</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Location & Date</th>
                <th className="px-4 py-3.5">Reported By</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const isLost = item.type === 'lost';
                const isResolved = item.status === 'resolved';
                const isPrivate = item.is_private;

                return (
                  <tr key={item.id} className={`hover:bg-slate-50/70 transition-colors ${
                    isPrivate ? 'bg-amber-50/20' : ''
                  }`}>
                    {/* Item */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                              No pic
                            </div>
                          )}
                        </div>
                        <div className="max-w-xs">
                          <button
                            onClick={() => handleInspect(item)}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left flex items-center gap-1 group"
                          >
                            <span className="line-clamp-1">{item.title}</span>
                            <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                          </button>
                          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {item.description || item.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Privacy Status Badge */}
                    <td className="px-4 py-4">
                      {isPrivate ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                          <Lock className="w-3 h-3 text-amber-700" />
                          🔒 PRIVATE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          <Unlock className="w-3 h-3 text-slate-400" />
                          🔓 Public
                        </span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        isLost ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isLost ? 'bg-rose-600' : 'bg-emerald-600'}`} />
                        {isLost ? 'LOST' : 'FOUND'}
                      </span>
                    </td>

                    {/* Location & Date */}
                    <td className="px-4 py-4 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800 line-clamp-1">{item.location}</div>
                      <div className="text-slate-400">{item.date}</div>
                    </td>

                    {/* Reported By */}
                    <td className="px-4 py-4 text-xs text-slate-600">
                      <div className="font-semibold text-slate-900">{item.contact_name}</div>
                      <a 
                        href={`mailto:${item.contact_email}?subject=Campus Admin Verification: ${encodeURIComponent(item.title)}`}
                        className="text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Mail className="w-3 h-3 text-blue-500" />
                        <span className="line-clamp-1">{item.contact_email}</span>
                      </a>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          isResolved 
                            ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {isResolved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Resolved
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                              Active
                            </>
                          )}
                        </span>

                        {item.is_verified && (
                          <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Admin Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* View Private / Full Details */}
                        <button
                          type="button"
                          onClick={() => handleInspect(item)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                          title="View complete report details"
                        >
                          View
                        </button>

                        {/* Contact Reporter */}
                        <a
                          href={`mailto:${item.contact_email}?subject=Campus Admin Follow-up: ${encodeURIComponent(item.title)}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={`Email ${item.contact_name}`}
                        >
                          <Mail className="w-4 h-4" />
                        </a>

                        {/* Verify Claim */}
                        <button
                          type="button"
                          onClick={() => handleToggleVerification(item)}
                          disabled={actionLoading === item.id}
                          className={`p-1.5 rounded-lg transition-colors ${
                            item.is_verified 
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' 
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={item.is_verified ? 'Remove verified badge' : 'Mark as verified by security'}
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>

                        {/* Resolve / Reopen */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          disabled={actionLoading === item.id}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                            isResolved
                              ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                          }`}
                          title={isResolved ? 'Reopen report' : 'Mark as resolved'}
                        >
                          {isResolved ? 'Reopen' : 'Resolve'}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={actionLoading === item.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 text-sm">
                    No reports match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Item Modal (for Admin Review of Sensitive/Private Reports) */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setInspectItem(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Banner */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {inspectItem.is_private ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black uppercase px-3 py-1 rounded-full bg-amber-500 text-white">
                    <Lock className="w-3.5 h-3.5" />
                    🔒 SENSITIVE PRIVATE REPORT
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    <Unlock className="w-3.5 h-3.5" />
                    🔓 Public Report
                  </span>
                )}

                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full text-white ${
                  inspectItem.type === 'lost' ? 'bg-rose-600' : 'bg-emerald-600'
                }`}>
                  {inspectItem.type.toUpperCase()}
                </span>

                {inspectItem.is_verified && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    ✓ Verified Claim
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black text-slate-900">
                {inspectItem.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {inspectItem.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {inspectItem.date}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {inspectItem.category}
                </span>
              </div>
            </div>

            {/* Photo */}
            {inspectItem.image_url && (
              <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-video max-h-64">
                <img
                  src={inspectItem.image_url}
                  alt={inspectItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Full Uncensored Description for Admin */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Full Description & Inscriptions
              </h4>
              <p className="text-sm text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-line">
                {inspectItem.description || 'No description provided.'}
              </p>
            </div>

            {/* Reporter Contact Info */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs sm:text-sm space-y-1.5">
              <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider">
                Reporter Contact Details
              </h4>
              <div className="text-slate-800 font-semibold">{inspectItem.contact_name}</div>
              <div className="text-slate-600 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <a href={`mailto:${inspectItem.contact_email}`} className="text-blue-600 hover:underline">
                  {inspectItem.contact_email}
                </a>
              </div>
              {inspectItem.contact_phone && (
                <div className="text-slate-600 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{inspectItem.contact_phone}</span>
                </div>
              )}
            </div>

            {/* AI Matching Engine Cross-Check */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Matching Engine Analysis ({aiMatches.length} candidate{aiMatches.length === 1 ? '' : 's'})
              </div>
              {aiMatches.length > 0 ? (
                <div className="space-y-2">
                  {aiMatches.slice(0, 2).map((m) => (
                    <div key={m.match.id} className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{m.match.title}</div>
                        <div className="text-slate-500 text-[11px]">{m.matchReasons.join(' • ')}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-purple-700 text-sm">{m.confidenceScore}%</span>
                        <div className="text-[10px] text-slate-400">Match score</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No automated matches found yet with opposing lost/found reports.
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleVerification(inspectItem)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  {inspectItem.is_verified ? 'Remove Verification' : '✓ Verify Claim'}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(inspectItem)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  {inspectItem.status === 'resolved' ? 'Reopen Report' : 'Mark as Resolved'}
                </button>
              </div>

              <a
                href={`mailto:${inspectItem.contact_email}?subject=Campus Admin Verification: ${encodeURIComponent(inspectItem.title)}`}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Reporter</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
