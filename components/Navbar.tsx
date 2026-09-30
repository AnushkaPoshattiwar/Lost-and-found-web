'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  Menu, 
  X, 
  Compass, 
  Sparkles,
  Database
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsDbConnected(isSupabaseConfigured());
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/items', label: 'Browse Items' },
    { href: '/my-reports', label: 'My Reports' },
    { href: '/lost', label: 'I Lost Something' },
    { href: '/found', label: 'I Found Something' },
    { href: '/admin', label: 'Admin' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 leading-tight tracking-tight flex items-center gap-1.5">
                Campus <span className="text-blue-600">Lost & Found</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                University Community Directory
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-blue-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Status Indicator */}
            <div 
              title={isDbConnected ? 'Connected to Supabase PostgreSQL' : 'Local storage demo mode active'}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                isDbConnected 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${isDbConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="font-medium">{isDbConnected ? 'Supabase Live' : 'Demo Mode'}</span>
            </div>

            <Link
              href="/lost"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Item</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs text-slate-500">System Status:</span>
            <div className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${
              isDbConnected 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isDbConnected ? 'Supabase Live' : 'Demo Mode'}
            </div>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.href)
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 grid grid-cols-2 gap-2">
            <Link
              href="/lost"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 px-3 rounded-lg text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-200"
            >
              I Lost Something
            </Link>
            <Link
              href="/found"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 px-3 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              I Found Something
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
