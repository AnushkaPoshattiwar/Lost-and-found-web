'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  MapPin, 
  Tag, 
  RotateCcw, 
  PlusCircle, 
  FileQuestion, 
  Gift, 
  SlidersHorizontal,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { Item, CATEGORIES, CAMPUS_LOCATIONS } from '@/types';
import { getItems } from '@/lib/itemsStore';
import ItemCard from '@/components/ItemCard';

function ItemsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams.get('search') || '';
  const initialType = searchParams.get('type') || 'all';
  const initialCategory = searchParams.get('category') || 'all';
  const initialLocation = searchParams.get('location') || 'all';
  const initialStatus = searchParams.get('status') || 'all';

  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState(initialType);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [status, setStatus] = useState(initialStatus);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state if query params change externally
  useEffect(() => {
    if (searchParams.get('search') !== null) setSearch(searchParams.get('search') || '');
    if (searchParams.get('type') !== null) setType(searchParams.get('type') || 'all');
    if (searchParams.get('category') !== null) setCategory(searchParams.get('category') || 'all');
    if (searchParams.get('location') !== null) setLocation(searchParams.get('location') || 'all');
  }, [searchParams]);

  useEffect(() => {
    async function fetchFiltered() {
      setLoading(true);
      try {
        const data = await getItems({
          search,
          type,
          category,
          location,
          status,
        });
        setItems(data);
      } catch (err) {
        console.error('Failed to query items:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchFiltered();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, type, category, location, status]);

  const handleResetFilters = () => {
    setSearch('');
    setType('all');
    setCategory('all');
    setLocation('all');
    setStatus('all');
    router.replace('/items');
  };

  const hasActiveFilters = search !== '' || type !== 'all' || category !== 'all' || location !== 'all' || status !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Lost & Found
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Search items reported missing or found across campus buildings, lawns, and facilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/lost')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
          >
            <FileQuestion className="w-4 h-4" />
            <span>Report Lost</span>
          </button>
          <button
            onClick={() => router.push('/found')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
          >
            <Gift className="w-4 h-4" />
            <span>Report Found</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
        {/* Top Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search items by keywords (e.g., 'wallet', 'AirPods', 'blue backpack', 'calculator')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/70 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Type Segmented Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Report Type
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setType('all')}
                className={`text-xs font-semibold py-1.5 rounded-lg transition-all ${
                  type === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setType('lost')}
                className={`text-xs font-semibold py-1.5 rounded-lg transition-all ${
                  type === 'lost'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-rose-600'
                }`}
              >
                Lost
              </button>
              <button
                type="button"
                onClick={() => setType('found')}
                className={`text-xs font-semibold py-1.5 rounded-lg transition-all ${
                  type === 'found'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-emerald-600'
                }`}
              >
                Found
              </button>
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              Campus Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-slate-400" />
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Reports Only</option>
              <option value="resolved">Resolved / Returned Only</option>
            </select>
          </div>
        </div>

        {/* Active Filters / Reset row */}
        {hasActiveFilters && (
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
            <span>Filtered results</span>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
        <div>
          Showing <span className="font-bold text-slate-800">{items.length}</span> {items.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-2xl border border-slate-200 bg-white p-4 h-80 animate-pulse flex flex-col justify-between">
              <div className="w-full h-44 bg-slate-200 rounded-xl" />
              <div className="space-y-2 pt-4">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
          <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No items match your criteria</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing filters, or post a new report so others can reach out.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => router.push('/lost')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Report Missing Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ItemsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <ItemsContent />
    </Suspense>
  );
}
