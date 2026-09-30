'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, CheckCircle2, ArrowRight, Tag, HelpCircle, Lock } from 'lucide-react';
import { Item } from '@/types';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';

  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col h-full ${
      isResolved 
        ? 'border-slate-200 bg-slate-50/40 opacity-80 hover:opacity-100 hover:shadow-md' 
        : 'border-slate-200/80 hover:border-blue-300 shadow-sm hover:shadow-xl hover:-translate-y-1'
    }`}>
      {/* Image Thumbnail Header */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
        {item.image_url && !imageError ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4 text-center">
            <HelpCircle className="w-10 h-10 mb-1 stroke-1 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">No Photo Provided</span>
          </div>
        )}

        {/* Badges on top of image */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          {/* Lost / Found Badge */}
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${
            isLost 
              ? 'bg-rose-600/90 text-white' 
              : 'bg-emerald-600/90 text-white'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {isLost ? 'LOST' : 'FOUND'}
          </span>

          {/* Private Badge if applicable */}
          {item.is_private && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm backdrop-blur-md">
              <Lock className="w-3 h-3" />
              Private
            </span>
          )}

          {/* Resolved Badge */}
          {isResolved && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900/85 text-emerald-300 shadow-sm backdrop-blur-md">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Returned / Resolved
            </span>
          )}
        </div>

        {/* Category Pill on bottom right */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="text-[11px] font-medium bg-black/60 text-white backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1">
            <Tag className="w-2.5 h-2.5" />
            {item.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
          {/* Location & Date Meta */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate max-w-[60%]">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate font-medium">{item.location}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* View Details Link */}
          <Link
            href={`/items/${item.id}`}
            className="mt-2 w-full inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-transparent transition-all group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
