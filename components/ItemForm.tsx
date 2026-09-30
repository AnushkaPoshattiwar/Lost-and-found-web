'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  MapPin, 
  Calendar, 
  Tag, 
  User, 
  Mail, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ImageIcon, 
  Sparkles,
  X
} from 'lucide-react';
import { ItemType, CATEGORIES, CAMPUS_LOCATIONS } from '@/types';
import { createItem } from '@/lib/itemsStore';

interface ItemFormProps {
  type: ItemType;
}

export default function ItemForm({ type }: ItemFormProps) {
  const router = useRouter();
  const isLost = type === 'lost';

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0] as string,
    description: '',
    location: CAMPUS_LOCATIONS[0] as string,
    customLocation: '',
    date: todayStr,
    image_url: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [useCustomLocation, setUseCustomLocation] = useState(false);

  // Quick preset sample images for instant prototyping
  const samplePresets = isLost 
    ? [
        { label: 'Laptop', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80' },
        { label: 'AirPods', url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80' },
        { label: 'ID Card', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
        { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
      ]
    : [
        { label: 'Calculator', url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80' },
        { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80' },
        { label: 'Keys', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80' },
        { label: 'Umbrella', url: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?auto=format&fit=crop&w=600&q=80' },
      ];

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Please select an image smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, image_url: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    setImagePreview(url);
    setFormData((prev) => ({ ...prev, image_url: url }));
  };

  const clearImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.title.trim()) {
      setErrorMsg('Please enter an item title / name.');
      return;
    }
    if (!formData.contact_name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!formData.contact_email.trim() || !formData.contact_email.includes('@')) {
      setErrorMsg('Please enter a valid contact email.');
      return;
    }

    const finalLocation = useCustomLocation 
      ? formData.customLocation.trim() || 'Campus'
      : formData.location;

    setIsSubmitting(true);

    try {
      await createItem({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        type,
        location: finalLocation,
        date: formData.date,
        image_url: formData.image_url || undefined,
        contact_name: formData.contact_name.trim(),
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone.trim() || undefined,
        status: 'active',
      });

      // Redirect to items browse page
      router.push('/items');
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg(err?.message || 'Failed to submit report. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Form Header Banner */}
      <div className={`px-6 py-5 border-b ${
        isLost 
          ? 'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-100 text-rose-950' 
          : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100 text-emerald-950'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
            isLost ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            {isLost ? 'Lost Item Report' : 'Found Item Report'}
          </span>
        </div>
        <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight">
          {isLost ? 'Report Something You Lost' : 'Report Something You Found'}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {isLost 
            ? 'Provide key details so anyone who spots or turns in your item can contact you immediately.' 
            : 'Help reunite this item with its rightful owner by detailing where and when you found it.'}
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Notice</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Section 1: Item Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-slate-400" />
            1. Item Details
          </h3>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Item Name / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={isLost ? "e.g., Black Dell XPS 15 Laptop, Apple AirPods, Leather Wallet" : "e.g., Hydro Flask Bottle, Casio FX-991EX, Dorm Keys"}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date {isLost ? 'Lost' : 'Found'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                max={todayStr}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Where did you {isLost ? 'lose' : 'find'} it? <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setUseCustomLocation(!useCustomLocation)}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                {useCustomLocation ? 'Select from campus presets' : 'Enter custom location'}
              </button>
            </div>

            {useCustomLocation ? (
              <input
                type="text"
                placeholder="e.g. Science Quad picnic bench, bus stop #4, Chemistry lab 204"
                value={formData.customLocation}
                onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
              />
            ) : (
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Description & Identifying Features
            </label>
            <textarea
              rows={3}
              placeholder={isLost 
                ? "Describe color, brand, distinct scratches, stickers, contents, or case details..." 
                : "Describe where it was resting, appearance, or safe retrieval instructions..."}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none resize-y"
            />
          </div>
        </div>

        {/* Section 2: Photo Upload */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-slate-400" />
            2. Photo (Optional but Recommended)
          </h3>

          {imagePreview ? (
            <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-700">
                Upload item photo from device
              </div>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
              <label className="mt-3 inline-block cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm">
                Browse Files
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              {/* Sample presets for fast prototyping */}
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-400 block mb-1.5">
                  Or pick a demo photo preset:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {samplePresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Contact Information */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-400" />
            3. Your Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Campus Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. rahul@college.edu"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Phone / WhatsApp (Optional)
              </label>
              <input
                type="tel"
                placeholder="e.g. +1 (555) 234-5678"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            By submitting, this item report will be visible to campus students and staff.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all ${
              isLost
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Posting Report...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit {isLost ? 'Lost Item' : 'Found Item'} Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
