-- Campus Lost & Found Supabase Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- 1. Create the items table
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  location TEXT NOT NULL,
  date DATE NOT NULL,
  image_url TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create search & filter indexes
CREATE INDEX IF NOT EXISTS idx_items_type ON public.items(type);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies (For prototype: public read, insert, and update)
CREATE POLICY "Public items are viewable by everyone" 
  ON public.items FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can report an item" 
  ON public.items FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update item status" 
  ON public.items FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete an item in prototype" 
  ON public.items FOR DELETE 
  USING (true);

-- 5. Seed initial demo data
INSERT INTO public.items (
  title, description, category, type, location, date, image_url, contact_name, contact_email, contact_phone, status
) VALUES
(
  'Black Dell XPS 15 Laptop',
  'Black laptop with a blue Linux sticker and a university cyber club sticker on the lid. Left near the 2nd floor study cubicles.',
  'Electronics',
  'lost',
  'Central Library',
  '2026-09-29',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
  'Rahul Sharma',
  'rahul.s@campus.edu',
  '+1 (555) 234-5678',
  'active'
),
(
  'Apple AirPods Pro (2nd Gen)',
  'White charging case with a small red scratch on the back hinge. Name engraved: "Alex".',
  'Electronics',
  'lost',
  'Science Complex - Block B',
  '2026-09-28',
  'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
  'Alex Chen',
  'achen@campus.edu',
  '+1 (555) 345-6789',
  'active'
),
(
  'Casio Scientific Calculator FX-991EX',
  'Found on the back row desk after the Calculus II lecture at 11 AM. Has a small handwritten name tape inside the slide cover.',
  'Electronics',
  'found',
  'Math & CS Lecture Hall',
  '2026-09-29',
  'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
  'Sarah Jenkins',
  'sjenkins@campus.edu',
  '+1 (555) 456-7890',
  'active'
),
(
  'Stainless Steel Hydro Flask (32oz Cobalt Blue)',
  'Found on the bench next to the basketball court in the gymnasium. Contains stickers from national parks.',
  'Water Bottles & Tumblers',
  'found',
  'Sports Complex & Gym',
  '2026-09-27',
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
  'Coach Marcus',
  'marcus.athletics@campus.edu',
  '+1 (555) 567-8901',
  'active'
),
(
  'Student ID Card & Navy Lanyard',
  'Student ID card in a clear plastic badge holder attached to a navy blue campus lanyard. Has a bus pass inside.',
  'Identification & Cards',
  'lost',
  'Student Dining Hall / Cafeteria',
  '2026-09-29',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'Priya Patel',
  'priya.p@campus.edu',
  '+1 (555) 678-9012',
  'active'
),
(
  'Dorm & Bicycle Keys on Red Carabiner',
  'Found a set of 3 keys including a Yale brass key and a silver Kryptonite bike lock key on an aluminum red carabiner.',
  'Keys',
  'found',
  'Campus Main Quad / Plaza',
  '2026-09-26',
  'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
  'David Miller',
  'dmiller@campus.edu',
  '+1 (555) 789-0123',
  'resolved'
);
