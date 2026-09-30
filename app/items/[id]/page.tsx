'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Tag, 
  Mail, 
  Phone, 
  User, 
  CheckCircle2, 
  RotateCcw, 
  Share2, 
  ShieldCheck, 
  HelpCircle,
  Loader2,
  AlertCircle,
  Lock,
  Unlock,
  ShieldAlert
} from 'lucide-react';
import { Item } from '@/types';
import { getItemById, updateItemStatus } from '@/lib/itemsStore';

function ItemDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id as string;
  const isAdmin = searchParams?.get('admin') === 'true';

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadItem() {
      if (!id) return;
      try {
        const found = await getItemById(id, { isAdmin });
        setItem(found);
      } catch (err) {
        console.error('Failed to load item:', err);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id, isAdmin]);

  const handleToggleStatus = async () => {
    if (!item) return;
    const nextStatus = item.status === 'resolved' ? 'active' : 'resolved';
    setStatusUpdating(true);
    try {
      const updated = await updateItemStatus(item.id, nextStatus);
      if (updated) {
        setItem(updated);
        showToast(
          nextStatus === 'resolved' 
            ? '🎉 Item marked as resolved / returned!' 
            : 'Item status reopened to Active.'
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('Failed to update status. Please try again.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Item Not Found</h2>
        <p className="text-sm text-slate-600 mt-2">
          The requested report may have been removed or does not exist.
        </p>
        <Link
          href="/items"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Browse</span>
        </Link>
      </div>
    );
  }

  // SENSITIVE ITEM PRIVACY PROTECTION CHECK:
  // If private and user is not an authorized administrator, shield all details!
  if (item.is_private && !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div>
          <Link
            href="/items"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-amber-200 p-8 sm:p-10 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              🔒 Protected Report
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              🔒 Sensitive Item
            </h1>
            <p className="text-sm font-semibold text-slate-700">
              “This report contains protected information and is not publicly accessible.”
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-950 leading-relaxed text-left space-y-2">
            <p>
              Because this item was marked as valuable or sensitive, its detailed description, specific engravings/serials, photo, and reporter contact information are hidden from public listings to prevent fraudulent claims.
            </p>
            <p className="font-semibold text-amber-950 pt-1">
              If you believe this is your missing property, please contact campus administration or security for assisted verification:
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 text-xs">
              <a
                href="mailto:lostandfound@campus.edu?subject=Sensitive Item Claim Assistance"
                className="inline-flex items-center gap-1.5 font-bold text-amber-900 hover:underline"
              >
                <Mail className="w-4 h-4 text-amber-700" />
                <span>lostandfound@campus.edu</span>
              </a>
              <span className="hidden sm:inline text-amber-300">•</span>
              <span className="flex items-center gap-1.5 text-amber-800">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Security Desk (Main Quad Room 104)</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/items"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Return to Public Browse
            </Link>
            <Link
              href={`/admin`}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Staff Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';

  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const mailtoSubject = encodeURIComponent(`Campus Lost & Found: Regarding "${item.title}"`);
  const mailtoBody = encodeURIComponent(
    `Hi ${item.contact_name},\n\nI saw your report on the Campus Lost & Found directory regarding:\n"${item.title}" (Report ID: ${item.id.slice(0, 8)})\n\nI would like to coordinate returning / reclaiming this item.\n\nBest regards,\n[Your Name]`
  );
  const mailtoHref = `mailto:${item.contact_email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <Link
          href="/items"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Copied Link!' : 'Share Report'}</span>
        </button>
      </div>

      {/* Admin Sensitive Report Banner */}
      {item.is_private && isAdmin && (
        <div className="p-4 rounded-2xl bg-amber-500 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <Lock className="w-4 h-4" />
            <span>🔒 Sensitive Item (Authorized Admin View)</span>
          </div>
          <span className="text-xs bg-black/20 px-2.5 py-0.5 rounded-md font-semibold">
            Hidden from Public Listings
          </span>
        </div>
      )}

      {/* Main Item Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner with Badges */}
        <div className={`p-6 sm:p-8 border-b ${
          isLost 
            ? 'bg-gradient-to-r from-rose-50/70 to-pink-50/70 border-rose-100' 
            : 'bg-gradient-to-r from-emerald-50/70 to-teal-50/70 border-emerald-100'
        }`}>
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-sm ${
              isLost ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {isLost ? 'LOST ITEM' : 'FOUND ITEM'}
            </span>

            {/* Privacy indicator */}
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              item.is_private ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-700'
            }`}>
              {item.is_private ? '🔒 Private' : '🔓 Public'}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-700">
              <Tag className="w-3 h-3 text-slate-500" />
              {item.category}
            </span>

            {item.is_verified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Verified
              </span>
            )}

            {isResolved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-900 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Resolved & Returned
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {item.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span className="font-semibold text-slate-800">{item.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Date: {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Col 1: Photo */}
          <div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square sm:aspect-auto sm:h-96 relative flex items-center justify-center">
              {item.image_url && !imageError ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <HelpCircle className="w-16 h-16 stroke-1 mb-2 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-500">No Image Provided</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Refer to identifying description details below
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Col 2: Details & Contact Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Description & Notes
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                  {item.description || 'No additional description provided.'}
                </p>
              </div>

              {/* Reporter Information Card */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-gradient-to-br from-white to-slate-50 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Reported By
                </h3>

                <div className="space-y-1.5 text-sm">
                  <div className="font-bold text-slate-900 text-base">
                    {item.contact_name}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>{item.contact_email}</span>
                  </div>
                  {item.contact_phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>{item.contact_phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {/* Primary Contact Button */}
              <a
                href={mailtoHref}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 hover:shadow-lg transition-all text-sm group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Contact {item.contact_name}</span>
              </a>

              {/* Mark as Resolved / Reopen */}
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={statusUpdating}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-semibold text-sm transition-all border ${
                  isResolved
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                } disabled:opacity-60`}
              >
                {statusUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating status...</span>
                  </>
                ) : isResolved ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Reopen Report (Mark Active)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mark as Resolved / Returned</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice Card */}
      <div className="p-5 bg-slate-100/70 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-slate-600">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Campus Safety Reminder: </span>
          Arrange all item handoffs in well-trafficked public campus spaces during daylight hours, or meet directly at the Central Campus Security Desk.
        </div>
      </div>
    </div>
  );
}

export default function ItemDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <ItemDetailContent />
    </Suspense>
  );
}
