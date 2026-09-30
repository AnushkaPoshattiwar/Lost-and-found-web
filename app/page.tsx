'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  PlusCircle, 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  HelpCircle,
  FileQuestion,
  Gift,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Item } from '@/types';
import { getItems } from '@/lib/itemsStore';
import ItemCard from '@/components/ItemCard';

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const items = await getItems();
        setRecentItems(items.slice(0, 6));
      } catch (err) {
        console.error('Failed to load recent items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/items?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/items');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 border-b border-slate-200/80 pt-12 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.15] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-6 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Official University Lost & Found Portal
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Lost something on campus? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Find it. Return it.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The quickest way for students, faculty, and campus staff to report missing items, 
            broadcast found property, and coordinate safe returns.
          </p>

          {/* Two Big Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/lost"
              className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base group"
            >
              <FileQuestion className="w-5 h-5 text-rose-200 group-hover:scale-110 transition-transform" />
              <span>I Lost Something</span>
            </Link>

            <Link
              href="/found"
              className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base group"
            >
              <Gift className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>I Found Something</span>
            </Link>
          </div>

          {/* Instant Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by keyword (e.g. Dell laptop, wallet, AirPods, keys, water bottle)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-slate-300/90 bg-white/95 text-slate-800 placeholder:text-slate-400 text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick link to browse */}
          <div className="mt-4">
            <Link
              href="/items"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>🔍 Or browse all lost & found items with filters</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Reports Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              Latest Campus Activity
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Recent Reports
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Recently reported lost and found items from across all campus facilities.
            </p>
          </div>

          <Link
            href="/items"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            <span>View All Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl border border-slate-200 bg-white p-4 h-80 animate-pulse flex flex-col justify-between">
                <div className="w-full h-44 bg-slate-200 rounded-xl" />
                <div className="space-y-2 pt-4">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">No items reported yet</p>
            <p className="text-xs text-slate-500 mt-1">Be the first to post a lost or found item.</p>
          </div>
        )}
      </section>

      {/* How it Works / 3-Step Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              How Campus Lost & Found Works
            </h2>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Designed specifically for fast turnarounds without requiring account creation or mobile installations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {/* Step 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg mb-4 border border-rose-500/30">
                1
              </div>
              <h3 className="font-bold text-lg text-white mb-2">1. Post a Report</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Lost an item or found someone else's? Submit the form in under 60 seconds with location, date, and photo.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-4 border border-blue-500/30">
                2
              </div>
              <h3 className="font-bold text-lg text-white mb-2">2. Search & Browse</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Filter by campus zone (Library, Cafeteria, Sports Gym) and item category to instantly find matching reports.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4 border border-emerald-500/30">
                3
              </div>
              <h3 className="font-bold text-lg text-white mb-2">3. Connect & Return</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Directly email the finder or owner with one click to arrange a safe campus handoff, then mark the report resolved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
