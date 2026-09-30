import { Item, ItemStatus } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

const INITIAL_SEED_ITEMS: Item[] = [
  {
    id: '1a91e57c-8e47-4f6b-9442-998cb6b1a001',
    title: 'Black Dell XPS 15 Laptop',
    description: 'Black laptop with a blue Linux sticker and a university cyber club sticker on the lid. Left near the 2nd floor study cubicles.',
    category: 'Electronics',
    type: 'lost',
    location: 'Central Library',
    date: '2026-09-29',
    image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    contact_name: 'Rahul Sharma',
    contact_email: 'rahul.s@campus.edu',
    contact_phone: '+1 (555) 234-5678',
    status: 'active',
    created_at: '2026-09-29T10:15:00Z',
  },
  {
    id: '2b82f68d-7f58-4a7c-8553-889da7c2b002',
    title: 'Apple AirPods Pro (2nd Gen)',
    description: 'White charging case with a small red scratch on the back hinge. Name engraved: "Alex".',
    category: 'Electronics',
    type: 'lost',
    location: 'Science Complex - Block B',
    date: '2026-09-28',
    image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    contact_name: 'Alex Chen',
    contact_email: 'achen@campus.edu',
    contact_phone: '+1 (555) 345-6789',
    status: 'active',
    created_at: '2026-09-28T14:30:00Z',
  },
  {
    id: '3c73e79e-6e69-4b8d-9664-770eb8d3c003',
    title: 'Casio Scientific Calculator FX-991EX',
    description: 'Found on the back row desk after the Calculus II lecture at 11 AM. Has a small handwritten name tape inside the slide cover.',
    category: 'Electronics',
    type: 'found',
    location: 'Math & CS Lecture Hall',
    date: '2026-09-29',
    image_url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
    contact_name: 'Sarah Jenkins',
    contact_email: 'sjenkins@campus.edu',
    contact_phone: '+1 (555) 456-7890',
    status: 'active',
    created_at: '2026-09-29T12:00:00Z',
  },
  {
    id: '4d64f8af-5d70-4c9e-8775-661fc9e4d004',
    title: 'Stainless Steel Hydro Flask (32oz Cobalt Blue)',
    description: 'Found on the bench next to the basketball court in the gymnasium. Contains stickers from national parks.',
    category: 'Water Bottles & Tumblers',
    type: 'found',
    location: 'Sports Complex & Gym',
    date: '2026-09-27',
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    contact_name: 'Coach Marcus',
    contact_email: 'marcus.athletics@campus.edu',
    contact_phone: '+1 (555) 567-8901',
    status: 'active',
    created_at: '2026-09-27T16:45:00Z',
  },
  {
    id: '5e55e9ba-4c81-4d0f-9886-552ad0f5e005',
    title: 'Student ID Card & Navy Lanyard',
    description: 'Student ID card in a clear plastic badge holder attached to a navy blue campus lanyard. Has a bus pass inside.',
    category: 'Identification & Cards',
    type: 'lost',
    location: 'Student Dining Hall / Cafeteria',
    date: '2026-09-29',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    contact_name: 'Priya Patel',
    contact_email: 'priya.p@campus.edu',
    contact_phone: '+1 (555) 678-9012',
    status: 'active',
    created_at: '2026-09-29T18:20:00Z',
  },
  {
    id: '6f46f0cb-3b92-4e1a-8997-443be1a6f006',
    title: 'Dorm & Bicycle Keys on Red Carabiner',
    description: 'Found a set of 3 keys including a Yale brass key and a silver Kryptonite bike lock key on an aluminum red carabiner.',
    category: 'Keys',
    type: 'found',
    location: 'Campus Main Quad / Plaza',
    date: '2026-09-26',
    image_url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    contact_name: 'David Miller',
    contact_email: 'dmiller@campus.edu',
    contact_phone: '+1 (555) 789-0123',
    status: 'resolved',
    created_at: '2026-09-26T09:10:00Z',
  }
];

const LOCAL_STORAGE_KEY = 'campus_lost_found_items_v1';

function getLocalItems(): Item[] {
  if (typeof window === 'undefined') {
    return INITIAL_SEED_ITEMS;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_ITEMS));
      return INITIAL_SEED_ITEMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEED_ITEMS;
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return INITIAL_SEED_ITEMS;
  }
}

function saveLocalItems(items: Item[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

export interface ItemFilters {
  type?: string;
  category?: string;
  location?: string;
  search?: string;
  status?: string;
}

export async function getItems(filters?: ItemFilters): Promise<Item[]> {
  // If Supabase is configured, fetch from Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('items').select('*').order('created_at', { ascending: false });

      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.location && filters.location !== 'all') {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.search && filters.search.trim() !== '') {
        const term = filters.search.trim();
        query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%,location.ilike.%${term}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as Item[];
      }
      console.warn('Supabase query failed, falling back to local store:', error?.message);
    } catch (err) {
      console.warn('Supabase request threw error, using fallback:', err);
    }
  }

  // Fallback to local storage
  let items = getLocalItems();

  if (filters?.type && filters.type !== 'all') {
    items = items.filter((item) => item.type === filters.type);
  }
  if (filters?.category && filters.category !== 'all') {
    items = items.filter((item) => item.category === filters.category);
  }
  if (filters?.location && filters.location !== 'all') {
    items = items.filter((item) =>
      item.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  if (filters?.status && filters.status !== 'all') {
    items = items.filter((item) => item.status === filters.status);
  }
  if (filters?.search && filters.search.trim() !== '') {
    const term = filters.search.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    );
  }

  return [...items].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getItemById(id: string): Promise<Item | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('items').select('*').eq('id', id).single();
      if (!error && data) {
        return data as Item;
      }
    } catch (err) {
      console.warn('Supabase getItemById failed:', err);
    }
  }

  const items = getLocalItems();
  return items.find((item) => item.id === id) || null;
}

export async function createItem(
  newItemData: Omit<Item, 'id' | 'created_at' | 'status'> & { status?: ItemStatus }
): Promise<Item> {
  const newItem: Item = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}`,
    ...newItemData,
    status: newItemData.status || 'active',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('items').insert([newItem]).select().single();
      if (!error && data) {
        return data as Item;
      }
      console.warn('Supabase createItem error:', error?.message);
    } catch (err) {
      console.warn('Supabase createItem threw error:', err);
    }
  }

  const items = getLocalItems();
  const updated = [newItem, ...items];
  saveLocalItems(updated);
  return newItem;
}

export async function updateItemStatus(id: string, status: ItemStatus): Promise<Item | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('items')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return data as Item;
      }
    } catch (err) {
      console.warn('Supabase updateItemStatus error:', err);
    }
  }

  const items = getLocalItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  items[index] = { ...items[index], status };
  saveLocalItems(items);
  return items[index];
}

export async function deleteItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase deleteItem error:', err);
    }
  }

  const items = getLocalItems();
  const filtered = items.filter((i) => i.id !== id);
  saveLocalItems(filtered);
  return true;
}

export function resetSeedData(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_ITEMS));
  }
}
