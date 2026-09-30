'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Tag, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  FileQuestion, 
  Gift, 
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Item } from '@/types';
import { getMyReports } from '@/lib/itemsStore';

export default function MyReportsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const myItems = await getMyReports();
        setItems(myItems);
      } catch (err) {
        console.error('Failed to load my reports:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          Personal Report Tracking
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Campus Reports
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Manage your reported lost and found items. Sensitive and valuable items marked as private 
          are securely protected here and hidden from public directory searches.
        </p>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500">Loading your reports...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Your Active & Tracked Items ({items.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => {
              const isLost = item.type === 'lost';
              const isPrivate = item.is_private;
              const isResolved = item.status === 'resolved';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full text-white ${
                        isLost ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}>
                        {isLost ? 'LOST' : 'FOUND'}
                      </span>

                      {/* Privacy Badge */}
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isPrivate 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {isPrivate ? (
                          <>
                            <Lock className="w-3 h-3 text-amber-700" />
                            🔒 PRIVATE
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 text-slate-500" />
                            🔓 PUBLIC
                          </>
                        )}
                      </span>

                      {/* Admin Verification Badge */}
                      {item.is_verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          Verified
                        </span>
                      )}

                      {/* Resolved Badge */}
                      {isResolved && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900 text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Resolved
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {isPrivate && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-tight">
                        🔒 <strong>Privacy Protection Active:</strong> Hidden from public directory listings. Only authorized administrators can review.
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No reports on this device yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              When you submit a lost or found report (including private sensitive items), you can track its status here.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/lost"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
            >
              Report Lost Item
            </Link>
            <Link
              href="/found"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
            >
              Report Found Item
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
