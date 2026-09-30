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
  Filter
} from 'lucide-react';
import { Item, ItemStatus } from '@/types';
import { getItems, updateItemStatus, deleteItem, resetSeedData } from '@/lib/itemsStore';

export default function AdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const loadAllItems = async () => {
    setLoading(true);
    try {
      const data = await getItems();
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
      showFeedback(`Updated "${item.title}" to ${nextStatus}.`);
    } catch (err) {
      console.error(err);
      showFeedback('Failed to update status.');
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
      showFeedback(`Deleted "${title}".`);
    } catch (err) {
      console.error(err);
      showFeedback('Failed to delete item.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetSeed = () => {
    if (window.confirm('Reset all items back to initial demo campus dataset?')) {
      resetSeedData();
      loadAllItems();
      showFeedback('Demo data successfully reseeded.');
    }
  };

  // Filtered items for display
  const filtered = items.filter((item) => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.contact_name.toLowerCase().includes(q) ||
        item.contact_email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate summary metrics
  const totalCount = items.length;
  const activeLost = items.filter((i) => i.type === 'lost' && i.status === 'active').length;
  const activeFound = items.filter((i) => i.type === 'found' && i.status === 'active').length;
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
            Staff & Moderator Panel (Prototype View)
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Reports Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review submitted items, resolve completed claims, or remove spam reports.
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Reports</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalCount}</div>
          <div className="text-xs text-slate-400 mt-1">All time campus posts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
          <div className="text-xs font-semibold text-rose-600 uppercase">Active Lost</div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">{activeLost}</div>
          <div className="text-xs text-rose-400 mt-1">Awaiting discovery</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 uppercase">Active Found</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{activeFound}</div>
          <div className="text-xs text-emerald-400 mt-1">Waiting for owners</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
          <div className="text-xs font-semibold text-blue-600 uppercase">Resolved / Returned</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{resolvedCount}</div>
          <div className="text-xs text-blue-400 mt-1">Successfully reunited</div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search report title, reporter, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
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
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Location & Date</th>
                <th className="px-5 py-3.5">Reported By</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const isLost = item.type === 'lost';
                const isResolved = item.status === 'resolved';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
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
                        <div>
                          <Link
                            href={`/items/${item.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1 group"
                          >
                            <span>{item.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                          </Link>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        isLost ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isLost ? 'bg-rose-600' : 'bg-emerald-600'}`} />
                        {isLost ? 'LOST' : 'FOUND'}
                      </span>
                    </td>

                    {/* Location & Date */}
                    <td className="px-5 py-4 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800">{item.location}</div>
                      <div className="text-slate-400">{item.date}</div>
                    </td>

                    {/* Reported By */}
                    <td className="px-5 py-4 text-xs text-slate-600">
                      <div className="font-semibold text-slate-900">{item.contact_name}</div>
                      <div className="text-slate-500">{item.contact_email}</div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
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
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Toggle Status Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          disabled={actionLoading === item.id}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                            isResolved
                              ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                          }`}
                          title={isResolved ? 'Reopen report' : 'Mark as resolved'}
                        >
                          {isResolved ? 'Reopen' : 'Resolve'}
                        </button>

                        {/* Delete Button */}
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
                  <td colSpan={6} className="text-center py-12 text-slate-500 text-sm">
                    No reports match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
