# 🎓 Campus Lost & Found Web App

A clean, responsive, and robust web application designed for university and college campuses to quickly report, track, and return lost property.

---

## 🌟 Key Features

1. **📢 Report a Lost Item (`/lost`)**
   - Clean report form with item title, category, campus location, date, and description.
   - Upload device photos or select instant demo image presets.
   - Collects contact details (Name, Campus Email, optional phone).

2. **🎁 Report a Found Item (`/found`)**
   - Reusable streamlined form tailored for good Samaritans and campus staff.
   - Includes campus safe handover guidelines.

3. **🔍 Search & Browse Directory (`/items`)**
   - Instant real-time keyword search (title, description, location).
   - Filter pills: `[All Items]`, `[🔴 Lost Only]`, `[🟢 Found Only]`.
   - Category and campus location dropdown filters.
   - Active vs. Resolved status toggles.

4. **📄 Detailed Item View (`/items/[id]`)**
   - Full photo presentation, status pill, and detailed location/date metadata.
   - **One-click Contact Action**: Pre-filled `mailto:` link opening the default email client with item title and ID pre-populated in subject and body.
   - **Status Resolution**: Direct "Mark as Resolved / Returned" toggle with toast confirmation.
   - Link sharing to clipboard.

5. **🛡️ Campus Staff / Admin Management (`/admin`)**
   - Metric cards: Total Reports, Active Lost, Active Found, and Resolved Items.
   - Interactive table with quick status toggle (Resolve / Reopen) and deletion of spam reports.
   - "Reset Demo Data" button to restore default campus dataset at any time.

6. **⚡ Dual-Mode Storage Architecture**
   - **Out-of-the-Box Demo Mode**: Pre-loaded with realistic campus seed items (laptops, AirPods, calculators, ID cards, hydro flasks, keys) using local browser persistence. Runs immediately without needing any API keys.
   - **Supabase PostgreSQL Ready**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to instantly connect to a live Supabase database.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js (App Router) + React | Fast server & client rendering, file-based routing |
| **Styling** | Tailwind CSS | Modern, responsive campus design system |
| **Icons** | Lucide React | Clean, intuitive icons |
| **Database** | Supabase PostgreSQL / Local Hybrid Store | Cloud database with zero-setup local fallback |
| **Language** | TypeScript | Type safety across models and API contracts |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Setup (Optional for Live Production)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the script found in `supabase/schema.sql`.
3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
4. Restart the development server (`npm run dev`). The navbar will show `🟢 Supabase Live` automatically!

---

## 📁 Project Structure

```
Lost_and_Found/
├── app/
│   ├── layout.tsx         # Root layout with Navbar & Footer
│   ├── page.tsx           # Landing page with hero, action cards & recent items
│   ├── globals.css        # Tailwind styling & custom scrollbar
│   ├── lost/
│   │   └── page.tsx       # Report lost item route
│   ├── found/
│   │   └── page.tsx       # Report found item route
│   ├── items/
│   │   ├── page.tsx       # Browse items with search & filters
│   │   └── [id]/
│   │       └── page.tsx   # Item details, contact button & resolution
│   └── admin/
│       └── page.tsx       # Staff/Admin management dashboard
├── components/
│   ├── Navbar.tsx         # Navigation header & live status indicator
│   ├── Footer.tsx         # Campus directory footer
│   ├── ItemCard.tsx       # Responsive item card
│   └── ItemForm.tsx       # Reusable submission form for lost & found
├── lib/
│   ├── supabase.ts        # Supabase client initializer
│   └── itemsStore.ts      # Data repository layer with fallback
├── types/
│   └── index.ts           # TypeScript interfaces & campus categories
├── supabase/
│   └── schema.sql         # PostgreSQL table, RLS policies & seed data
├── package.json
└── README.md
```

---

## 🔮 Next Steps (Post-Prototype)

- **Campus SSO / Email Authentication**: Restrict posting to verified `@college.edu` domains.
- **Smart Matching Engine**: Automatically notify users when a found item matches an active lost report (by category, date window, and campus location).
- **Physical QR Code Badges**: Print item claim tickets for the Campus Security Desk.
