# ASA E-Commerce Platform

## Project Overview
Premium e-commerce platform for African-inspired fashion (Ankara prints, casual wear, accessories). Targets African diaspora globally via social media ads.

## Tech Stack
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Database**: PostgreSQL via Supabase + Prisma ORM
- **Auth**: Supabase Auth
- **Payments**: Stripe (cards, Apple Pay, Google Pay)
- **Email**: SendGrid
- **Storage**: Supabase Storage
- **Hosting**: Vercel

## Directory Structure
```
asa-ecommerce/
├── prisma/           # Schema, migrations, seed
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── (storefront)/  # Customer pages
│   │   ├── (admin)/       # Admin dashboard
│   │   └── api/           # API routes
│   ├── components/   # UI components
│   ├── lib/          # Utilities, clients
│   ├── hooks/        # Custom hooks
│   ├── store/        # Zustand stores
│   ├── types/        # TypeScript types
│   └── validations/  # Zod schemas
```

## Key Commands
```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm lint             # Run ESLint
pnpm prisma studio    # DB GUI
pnpm prisma migrate dev  # Run migrations
```

## Development Guidelines
- Use App Router patterns (server components by default, 'use client' only when needed)
- All API inputs validated with Zod
- Prisma for all DB operations (no raw SQL)
- Follow existing component patterns in src/components/
- Prices stored as Decimal(10,2) in DB, cents in Stripe
- Use `pnpm` as the package manager
- Mobile-first responsive design
- All pages should score 90+ on Lighthouse

## Environment Variables
See `.env.example` for all required variables. Never commit `.env.local`.

## Brand Colors
- Antique Gold: #C19A3E
- Deep Wine: #6B2D3C
- Terracotta: #C75B39
- Noir: #1A1714
- Cream Background: #F8F6F1
