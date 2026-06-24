# LOVELY ORDERS

Premium luxury cosmetics and skincare e-commerce platform built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Customer Storefront** — Products, categories, brands, collections, search, cart, checkout
- **Payments** — Vodafone Cash & InstaPay (manual verification)
- **Admin Dashboard** — Products, orders, inventory, CRM, CMS, marketing, SEO, security
- **Security** — Supabase Auth, RBAC, Row Level Security, audit logging
- **Demo Mode** — Runs without Supabase using built-in demo data

## Quick Start

### 1. Install dependencies

```bash
cd lovely-orders
npm install
```

### 2. Run in demo mode (no database)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Connect Supabase (production)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local` and fill in your keys
3. Run migrations:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

4. Create an admin user:
   - Sign up via Supabase Auth (email/password)
   - Insert into `admin_users` linking `auth_user_id` to the super_admin role

5. Start the app:

```bash
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service role key |
| `NEXT_PUBLIC_SITE_URL` | Site URL for SEO/sitemap |

## Project Structure

```
src/
├── app/
│   ├── (storefront)/     # Customer pages
│   ├── (admin)/admin/    # Admin dashboard
│   ├── auth/             # Login
│   ├── actions/          # Server actions
│   └── api/              # API routes
├── components/
│   ├── ui/               # Design system
│   ├── storefront/       # Store components
│   └── admin/            # Admin components
├── lib/                  # Utilities, Supabase, auth, validation
├── services/             # Business logic
├── stores/               # Zustand (cart, wishlist)
└── types/                # TypeScript types
supabase/migrations/      # Database schema, RLS, seed data
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/products` | Product catalog |
| `/checkout` | Checkout |
| `/track-order` | Order tracking |
| `/auth/admin/login` | Admin login |
| `/admin/dashboard` | Admin overview |

## Payment

- **Vodafone Cash:** 01067258266
- **InstaPay:** 01067258266

Admin verifies payments manually in Orders → Verify Payment.

## Deploy to Netlify

1. Connect your Git repository
2. Set environment variables in Netlify dashboard
3. Deploy — `netlify.toml` is preconfigured

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run typecheck  # TypeScript check
```

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (PostgreSQL, Auth, Storage, RLS)
- Zustand
- Zod + React Hook Form
