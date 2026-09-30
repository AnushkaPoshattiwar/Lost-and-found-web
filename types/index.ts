export type ItemType = 'lost' | 'found';
export type ItemStatus = 'active' | 'resolved';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  type: ItemType;
  location: string;
  date: string;
  image_url?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  status: ItemStatus;
  is_private?: boolean;
  is_verified?: boolean;
  created_at: string;
}

export const CATEGORIES = [
  'Electronics',
  'Wallets & Bags',
  'Identification & Cards',
  'Keys',
  'Books & Stationery',
  'Clothing & Accessories',
  'Water Bottles & Tumblers',
  'Sports Equipment',
  'Other',
] as const;

export const CAMPUS_LOCATIONS = [
  'Central Library',
  'Student Dining Hall / Cafeteria',
  'Engineering Building',
  'Science Complex - Block B',
  'Math & CS Lecture Hall',
  'Sports Complex & Gym',
  'Student Activity Center',
  'Campus Main Quad / Plaza',
  'North Parking Lot',
  'South Dormitories',
  'Auditorium',
  'Other / Off-Campus Transit',
] as const;
