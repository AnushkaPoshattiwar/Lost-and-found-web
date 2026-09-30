import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">Campus Lost & Found</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A community initiative connecting students, faculty, and campus security to quickly return lost property.
              Report lost items, upload photos of found items, and get items back to their rightful owners safely.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Campus Security & Student Services Partner</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/items" className="hover:text-white transition-colors">Browse Directory</Link>
              </li>
              <li>
                <Link href="/lost" className="hover:text-white transition-colors">Report Lost Item</Link>
              </li>
              <li>
                <Link href="/found" className="hover:text-white transition-colors">Report Found Item</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">Staff Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Campus Help</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Central Security Desk, Main Quad Building Room 104</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>lostandfound@campus.edu</span>
              </div>
              <p className="text-xs text-slate-500 pt-2">
                Valuable items (wallets, passports, electronics) should also be handed directly to Campus Police.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Campus Lost & Found. Open prototype for University Community.</p>
          <div className="flex gap-4">
            <span>Powered by Next.js & Supabase</span>
            <span>•</span>
            <Link href="/items" className="hover:underline">Browse All</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
