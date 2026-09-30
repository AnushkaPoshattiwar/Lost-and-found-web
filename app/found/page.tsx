import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import ItemForm from '@/components/ItemForm';

export const metadata = {
  title: 'Report a Found Item | Campus Lost & Found',
  description: 'Found an item on campus? Post the details here to help reconnect it with the owner.',
};

export default function FoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Report Form */}
      <ItemForm type="found" />

      {/* Safe Handover Tip */}
      <div className="mt-8 p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs sm:text-sm text-slate-700 space-y-2">
        <div className="font-bold text-emerald-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Safe Return Recommendation:
        </div>
        <p className="leading-relaxed">
          Thank you for being a good Samaritan! When meeting the claimant, always meet in a public, well-lit campus location 
          such as the Student Dining Hall, Central Library lobby, or Campus Security Office. Ask the claimant to verify specific identifying details before handing the item over.
        </p>
      </div>
    </div>
  );
}
