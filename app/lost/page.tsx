import React from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import ItemForm from '@/components/ItemForm';

export const metadata = {
  title: 'Report a Lost Item | Campus Lost & Found',
  description: 'Submit details about an item you lost on campus so fellow students and staff can help find it.',
};

export default function LostPage() {
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
      <ItemForm type="lost" />

      {/* Quick Tips */}
      <div className="mt-8 p-5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs sm:text-sm text-slate-700 space-y-2">
        <div className="font-bold text-blue-900 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Campus Lost & Found Protocol Tip:
        </div>
        <p className="leading-relaxed">
          If you lost a high-value item such as a passport, national ID, credit card, or expensive jewelry, 
          please also file an official physical report at the <strong>Campus Security Desk (Main Quad, Room 104)</strong>.
        </p>
      </div>
    </div>
  );
}
