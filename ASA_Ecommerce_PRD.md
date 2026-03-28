# ÀṢÀ E-Commerce Platform
## Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** March 2026  
**Status:** Ready for Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Technical Architecture](#3-technical-architecture)
4. [Frontend Specification & Usage Guide](#4-frontend-specification--usage-guide)
5. [Backend Specification & Usage Guide](#5-backend-specification--usage-guide)
6. [Database Design](#6-database-design)
7. [Third-Party Integrations](#7-third-party-integrations)
8. [Infrastructure & Deployment](#8-infrastructure--deployment)
9. [Security Requirements](#9-security-requirements)
10. [Performance Requirements](#10-performance-requirements)
11. [Development Phases & Timeline](#11-development-phases--timeline)
12. [Cost Estimation](#12-cost-estimation)

---

## 1. Executive Summary

### 1.1 Project Overview

ÀṢÀ is a premium e-commerce platform specializing in African-inspired fashion, targeting a global audience through social media advertising (Facebook, Instagram, TikTok). The platform sells unisex casual wear and traditional African attire (Ankara prints), positioned in the premium/luxury segment.

### 1.2 Business Objectives

- Launch a conversion-optimized e-commerce storefront
- Support global sales (150+ countries) with international shipping
- Optimize for social media ad traffic (mobile-first, fast-loading)
- Process payments via Stripe (cards, Apple Pay, Google Pay)
- Scale infrastructure to handle traffic spikes from ad campaigns

### 1.3 Target Market

| Segment | Description |
|---------|-------------|
| **Primary** | African diaspora in US, UK, Canada, Europe |
| **Secondary** | Fashion-forward consumers interested in African prints |
| **Demographics** | 25-45 years old, premium purchasing power |
| **Acquisition** | Facebook/Instagram/TikTok ads, influencer marketing |

### 1.4 Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend | Next.js 14+ (TypeScript) | SSR for SEO, fast ad-driven loads, React ecosystem |
| Backend | Next.js API Routes (Monolith) | Single codebase, faster dev, simpler deployment |
| Database | PostgreSQL (Supabase) | Relational data, built-in auth, real-time |
| Hosting | Vercel | Auto-scaling, global CDN, zero-config deploys |
| Payments | Stripe | Global coverage, PCI compliant |
| Storage | Supabase Storage | All-in-one with database |
| Email | SendGrid | Reliable, established deliverability |

---

## 2. Product Overview

### 2.1 Product Categories

| Category | Products | Price Range (USD) |
|----------|----------|-------------------|
| **Ankara Prints** | Dresses, Blazers, Shirts, Skirts, Two-piece Sets | $150 - $400 |
| **Casual Wear** | T-shirts, Hoodies, Joggers, Jackets | $80 - $250 |
| **Accessories** | Bags, Headwraps, Jewelry, Scarves | $40 - $180 |

### 2.2 Core Features (MVP)

#### Customer-Facing
- [ ] Product catalog with search & filters
- [ ] Product detail pages with image gallery
- [ ] Size guide / fit finder
- [ ] Shopping cart with promo codes
- [ ] Guest checkout (no account required)
- [ ] Wishlist & saved items
- [ ] Multi-currency display
- [ ] Product reviews & ratings
- [ ] Order tracking

#### Admin Dashboard
- [ ] Product management (CRUD)
- [ ] Inventory management with low stock alerts
- [ ] Order management & fulfillment
- [ ] Customer list & details
- [ ] Promo code management
- [ ] Analytics dashboard (revenue, orders, traffic)

#### Integrations
- [ ] Stripe payments (cards, Apple Pay, Google Pay)
- [ ] Facebook Pixel (Meta ads tracking)
- [ ] TikTok Pixel
- [ ] SendGrid (transactional emails)
- [ ] Supabase Storage (product images)

---

## 3. Technical Architecture

### 3.1 Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TECHNOLOGY STACK                               │
├─────────────────────────────────────────────────────────────────────────┤
│  Layer          │  Technology              │  Version                   │
├─────────────────────────────────────────────────────────────────────────┤
│  Language       │  TypeScript              │  5.x                       │
│  Frontend       │  Next.js (App Router)    │  14.x+                     │
│  Styling        │  Tailwind CSS            │  3.x                       │
│  UI Components  │  shadcn/ui               │  latest                    │
│  State Mgmt     │  Zustand                 │  4.x                       │
│  Forms          │  React Hook Form + Zod   │  latest                    │
│  Database       │  PostgreSQL              │  15.x (via Supabase)       │
│  ORM            │  Prisma                  │  5.x                       │
│  Auth           │  Supabase Auth           │  latest                    │
│  Payments       │  Stripe                  │  latest                    │
│  Email          │  SendGrid                │  latest                    │
│  File Storage   │  Supabase Storage        │  latest                    │
│  Hosting        │  Vercel                  │  latest                    │
│  Analytics      │  Facebook Pixel, TikTok  │  latest                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 CLIENTS                                      │
│    ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐               │
│    │  Mobile  │   │ Desktop  │   │ Facebook │   │  TikTok  │               │
│    │ Browser  │   │ Browser  │   │   Ads    │   │   Ads    │               │
│    └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘               │
└─────────┼──────────────┼──────────────┼──────────────┼──────────────────────┘
          │              │              │              │
          └──────────────┴──────────────┴──────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │      Vercel Edge        │
                    │    (Global CDN + SSL)   │
                    └───────────┬─────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS APPLICATION (Vercel)                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                        APP ROUTER (Frontend)                            │ │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │ │
│  │   │    Pages    │  │ Components  │  │   Hooks     │  │   Store     │  │ │
│  │   │  (SSR/SSG)  │  │ (shadcn/ui) │  │  (Custom)   │  │  (Zustand)  │  │ │
│  │   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                        API ROUTES (Backend)                             │ │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │ │
│  │   │  Products   │  │    Cart     │  │  Checkout   │  │   Admin     │  │ │
│  │   │    API      │  │    API      │  │    API      │  │    API      │  │ │
│  │   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │ │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                   │ │
│  │   │   Prisma    │  │  Webhooks   │  │   Server    │                   │ │
│  │   │    ORM      │  │  (Stripe)   │  │  Actions    │                   │ │
│  │   └─────────────┘  └─────────────┘  └─────────────┘                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└───────────────┬─────────────────┬─────────────────┬─────────────────────────┘
                │                 │                 │
                ▼                 ▼                 ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE                                      │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│   │   PostgreSQL    │  │   Supabase      │  │    Supabase     │          │
│   │    Database     │  │     Auth        │  │    Storage      │          │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘          │
└───────────────────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         THIRD-PARTY SERVICES                               │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│   │    Stripe    │  │   SendGrid   │  │   Facebook   │  │    TikTok    │ │
│   │  (Payments)  │  │   (Email)    │  │    Pixel     │  │    Pixel     │ │
│   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Directory Structure

```
asa-ecommerce/
├── .env.local                    # Local environment variables
├── .env.example                  # Environment template
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data
├── public/
│   ├── images/                   # Static images
│   └── fonts/                    # Custom fonts
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (storefront)/         # Customer-facing pages
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx      # Product listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Product detail
│   │   │   ├── cart/
│   │   │   │   └── page.tsx      # Shopping cart
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx      # Checkout flow
│   │   │   └── orders/
│   │   │       └── [id]/
│   │   │           └── page.tsx  # Order confirmation
│   │   ├── (admin)/              # Admin dashboard
│   │   │   └── admin/
│   │   │       ├── page.tsx      # Dashboard home
│   │   │       ├── products/
│   │   │       ├── orders/
│   │   │       ├── customers/
│   │   │       ├── promo-codes/
│   │   │       └── inventory/
│   │   ├── api/                  # API Routes
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   ├── wishlist/
│   │   │   ├── reviews/
│   │   │   ├── admin/
│   │   │   └── webhooks/
│   │   │       └── stripe/
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── layout/               # Header, Footer, Navigation
│   │   ├── product/              # Product-related components
│   │   ├── cart/                 # Cart components
│   │   ├── checkout/             # Checkout components
│   │   └── admin/                # Admin components
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client
│   │   ├── supabase.ts           # Supabase clients
│   │   ├── stripe.ts             # Stripe configuration
│   │   ├── sendgrid.ts           # SendGrid configuration
│   │   ├── utils.ts              # Utility functions
│   │   └── constants.ts          # App constants
│   ├── hooks/
│   │   ├── use-cart.ts           # Cart state hook
│   │   ├── use-wishlist.ts       # Wishlist hook
│   │   └── use-currency.ts       # Currency conversion hook
│   ├── store/
│   │   ├── cart-store.ts         # Zustand cart store
│   │   └── ui-store.ts           # UI state store
│   ├── types/
│   │   ├── product.ts            # Product types
│   │   ├── order.ts              # Order types
│   │   └── index.ts              # Type exports
│   └── validations/
│       ├── product.ts            # Product schemas
│       ├── checkout.ts           # Checkout schemas
│       └── admin.ts              # Admin schemas
└── package.json
```

---

## 4. Frontend Specification & Usage Guide

### 4.1 Getting Started

#### Prerequisites
- Node.js 18.x or higher
- pnpm (recommended) or npm
- Git

#### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-org/asa-ecommerce.git
cd asa-ecommerce

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Seed the database (optional)
pnpm prisma db seed

# Start development server
pnpm dev
```

#### Environment Variables (.env.local)

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="ÀṢÀ"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_postgres_connection_string

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# SendGrid
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=orders@asa-fashion.com

# Analytics
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id
NEXT_PUBLIC_TIKTOK_PIXEL_ID=your_tiktok_pixel_id

# Currency API (for multi-currency)
EXCHANGE_RATE_API_KEY=your_api_key
```

### 4.2 Page Structure

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Hero, featured products, categories, testimonials |
| `/products` | Product Listing | All products with filters, search, pagination |
| `/products/[slug]` | Product Detail | Images, variants, add to cart, reviews |
| `/cart` | Shopping Cart | Cart items, promo code, totals |
| `/checkout` | Checkout | Shipping, payment (Stripe) |
| `/orders/[id]` | Order Confirmation | Order summary, tracking |
| `/wishlist` | Wishlist | Saved items |
| `/size-guide` | Size Guide | Fit finder, measurement guide |
| `/admin` | Admin Dashboard | Overview, stats |
| `/admin/products` | Product Management | CRUD products |
| `/admin/orders` | Order Management | View, update orders |
| `/admin/customers` | Customer List | Customer details |
| `/admin/promo-codes` | Promo Codes | Create, manage discounts |
| `/admin/inventory` | Inventory | Stock levels, alerts |

### 4.3 Component Architecture

#### Layout Components

```typescript
// src/components/layout/header.tsx
import Link from 'next/link'
import { ShoppingBag, Heart, Search, Menu } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'

export function Header() {
  const { itemCount } = useCart()
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      {/* Announcement Bar */}
      <div className="bg-[#1A1A1A] text-white text-center py-2 text-sm">
        Free shipping on orders over $150 | Use code WELCOME15
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-[#D4A853]">
            ÀṢÀ
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link href="/products?category=ankara">Ankara Prints</Link>
            <Link href="/products?category=casual">Casual Wear</Link>
            <Link href="/products?category=accessories">Accessories</Link>
            <Link href="/size-guide">Size Guide</Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 cursor-pointer" />
            <Heart className="w-5 h-5 cursor-pointer" />
            <Link href="/cart" className="relative">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C75B39] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
```

#### Product Components

```typescript
// src/components/product/product-card.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useWishlist } from '@/hooks/use-wishlist'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)
  
  return (
    <div className="group relative">
      {/* Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md"
      >
        <Heart 
          className={`w-5 h-5 ${inWishlist ? 'fill-[#C75B39] text-[#C75B39]' : ''}`} 
        />
      </button>
      
      {/* Info */}
      <div className="mt-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-[#1A1A1A]">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500">{product.category.name}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold">{formatCurrency(product.price)}</span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
      
      {/* Quick Add (shows on hover) */}
      <div className="absolute bottom-20 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity px-4">
        <button className="w-full py-2 bg-[#1A1A1A] text-white rounded-md text-sm">
          Quick Add
        </button>
      </div>
    </div>
  )
}
```

### 4.4 State Management (Zustand)

```typescript
// src/store/cart-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  image: string
  price: number
  size: string
  color: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  promoCode: string | null
  discount: number
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  applyPromoCode: (code: string) => Promise<boolean>
  clearCart: () => void
  
  // Computed
  itemCount: number
  subtotal: number
  total: number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,
      
      addItem: (item) => {
        const id = `${item.productId}-${item.variantId}`
        const existing = get().items.find((i) => i.id === id)
        
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, id }] })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })
      },
      
      applyPromoCode: async (code) => {
        const res = await fetch('/api/promo-codes/validate', {
          method: 'POST',
          body: JSON.stringify({ code, subtotal: get().subtotal }),
        })
        const data = await res.json()
        
        if (data.valid) {
          set({ promoCode: code, discount: data.discount })
          return true
        }
        return false
      },
      
      clearCart: () => {
        set({ items: [], promoCode: null, discount: 0 })
      },
      
      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
      
      get subtotal() {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      },
      
      get total() {
        return get().subtotal - get().discount
      },
    }),
    {
      name: 'asa-cart',
    }
  )
)
```

### 4.5 Multi-Currency Support

```typescript
// src/hooks/use-currency.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const SUPPORTED_CURRENCIES = ['USD', 'GBP', 'EUR', 'CAD', 'NGN'] as const
type Currency = typeof SUPPORTED_CURRENCIES[number]

interface CurrencyStore {
  currency: Currency
  rates: Record<Currency, number>
  setCurrency: (currency: Currency) => void
  convert: (amountUSD: number) => number
  format: (amountUSD: number) => string
}

export const useCurrency = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: 'USD',
      rates: {
        USD: 1,
        GBP: 0.79,
        EUR: 0.92,
        CAD: 1.36,
        NGN: 1550,
      },
      
      setCurrency: (currency) => set({ currency }),
      
      convert: (amountUSD) => {
        const rate = get().rates[get().currency]
        return amountUSD * rate
      },
      
      format: (amountUSD) => {
        const converted = get().convert(amountUSD)
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: get().currency,
        }).format(converted)
      },
    }),
    {
      name: 'asa-currency',
    }
  )
)

// Usage in components:
// const { format, currency, setCurrency } = useCurrency()
// <span>{format(product.price)}</span>
```

### 4.6 Analytics Integration

```typescript
// src/lib/analytics.ts

// Facebook Pixel
export const fbPixel = {
  pageView: () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  },
  
  viewContent: (product: { id: string; name: string; price: number }) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'USD',
      })
    }
  },
  
  addToCart: (product: { id: string; name: string; price: number; quantity: number }) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price * product.quantity,
        currency: 'USD',
      })
    }
  },
  
  initiateCheckout: (value: number, items: string[]) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: items,
        value,
        currency: 'USD',
        num_items: items.length,
      })
    }
  },
  
  purchase: (orderId: string, value: number, items: string[]) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        content_ids: items,
        content_type: 'product',
        value,
        currency: 'USD',
        order_id: orderId,
      })
    }
  },
}

// TikTok Pixel
export const tiktokPixel = {
  pageView: () => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.page()
    }
  },
  
  viewContent: (product: { id: string; name: string; price: number }) => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('ViewContent', {
        content_id: product.id,
        content_name: product.name,
        content_type: 'product',
        price: product.price,
        currency: 'USD',
      })
    }
  },
  
  addToCart: (product: { id: string; price: number; quantity: number }) => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('AddToCart', {
        content_id: product.id,
        content_type: 'product',
        price: product.price,
        quantity: product.quantity,
        currency: 'USD',
      })
    }
  },
  
  purchase: (orderId: string, value: number) => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('CompletePayment', {
        content_type: 'product',
        value,
        currency: 'USD',
        order_id: orderId,
      })
    }
  },
}
```

### 4.7 Key Frontend Commands

```bash
# Development
pnpm dev                    # Start dev server (localhost:3000)
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm lint                   # Run ESLint
pnpm type-check             # Run TypeScript checks

# Database
pnpm prisma studio          # Open Prisma Studio (DB GUI)
pnpm prisma migrate dev     # Run migrations (dev)
pnpm prisma migrate deploy  # Run migrations (prod)
pnpm prisma db seed         # Seed database

# Testing
pnpm test                   # Run unit tests
pnpm test:e2e               # Run E2E tests (Playwright)

# Utilities
pnpm shadcn-ui add button   # Add shadcn component
pnpm analyze                # Analyze bundle size
```

---

## 5. Backend Specification & Usage Guide

### 5.1 API Architecture

The backend uses Next.js API Routes (App Router) with the following structure:

```
src/app/api/
├── products/
│   ├── route.ts              # GET /api/products (list, search, filter)
│   └── [slug]/
│       └── route.ts          # GET /api/products/:slug
├── cart/
│   ├── route.ts              # GET, POST /api/cart
│   └── items/
│       └── [id]/
│           └── route.ts      # PATCH, DELETE /api/cart/items/:id
├── checkout/
│   └── route.ts              # POST /api/checkout (create Stripe session)
├── orders/
│   ├── route.ts              # GET /api/orders (user's orders)
│   └── [id]/
│       └── route.ts          # GET /api/orders/:id
├── wishlist/
│   ├── route.ts              # GET, POST /api/wishlist
│   └── [productId]/
│       └── route.ts          # DELETE /api/wishlist/:productId
├── reviews/
│   └── route.ts              # GET, POST /api/reviews
├── promo-codes/
│   └── validate/
│       └── route.ts          # POST /api/promo-codes/validate
├── admin/
│   ├── dashboard/
│   │   └── route.ts          # GET /api/admin/dashboard
│   ├── products/
│   │   ├── route.ts          # GET, POST /api/admin/products
│   │   └── [id]/
│   │       └── route.ts      # GET, PATCH, DELETE
│   ├── orders/
│   │   ├── route.ts          # GET /api/admin/orders
│   │   └── [id]/
│   │       └── route.ts      # GET, PATCH
│   ├── customers/
│   │   └── route.ts          # GET /api/admin/customers
│   ├── promo-codes/
│   │   ├── route.ts          # GET, POST
│   │   └── [id]/
│   │       └── route.ts      # PATCH, DELETE
│   ├── inventory/
│   │   └── route.ts          # GET, PATCH
│   └── upload/
│       └── route.ts          # POST /api/admin/upload
└── webhooks/
    └── stripe/
        └── route.ts          # POST /api/webhooks/stripe
```

### 5.2 API Endpoints Reference

#### Products API

```typescript
// GET /api/products
// Query params: category, search, minPrice, maxPrice, size, color, sort, page, limit

// Response
{
  "products": [
    {
      "id": "prod_123",
      "slug": "ankara-blazer-gold",
      "name": "Ankara Blazer - Gold Pattern",
      "description": "Premium tailored blazer...",
      "price": 285.00,
      "comparePrice": 350.00,
      "images": ["url1", "url2"],
      "category": { "id": "cat_1", "name": "Ankara Prints", "slug": "ankara" },
      "variants": [
        { "id": "var_1", "size": "S", "color": "Gold", "stock": 5 },
        { "id": "var_2", "size": "M", "color": "Gold", "stock": 8 }
      ],
      "averageRating": 4.5,
      "reviewCount": 23
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "pages": 4
  }
}

// GET /api/products/:slug
// Response: Single product with full details
```

#### Cart API

```typescript
// GET /api/cart
// Headers: x-session-id: "session_xxx" (for guest carts)

// Response
{
  "id": "cart_123",
  "items": [
    {
      "id": "item_1",
      "product": { "id": "prod_123", "name": "...", "image": "..." },
      "variant": { "id": "var_1", "size": "M", "color": "Gold" },
      "quantity": 2,
      "price": 285.00,
      "total": 570.00
    }
  ],
  "subtotal": 570.00,
  "promoCode": "WELCOME15",
  "discount": 85.50,
  "total": 484.50
}

// POST /api/cart
// Body
{
  "productId": "prod_123",
  "variantId": "var_1",
  "quantity": 1
}

// PATCH /api/cart/items/:id
// Body
{
  "quantity": 3
}

// DELETE /api/cart/items/:id
```

#### Checkout API

```typescript
// POST /api/checkout
// Body
{
  "cartId": "cart_123",
  "shipping": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": {
      "line1": "123 Main St",
      "line2": "Apt 4",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    }
  },
  "currency": "USD"
}

// Response
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_xxx",
  "sessionId": "cs_xxx"
}
```

#### Admin API

```typescript
// GET /api/admin/dashboard
// Response
{
  "revenue": {
    "today": 1250.00,
    "thisWeek": 8540.00,
    "thisMonth": 32150.00,
    "growth": 12.5  // percentage vs last month
  },
  "orders": {
    "pending": 5,
    "processing": 12,
    "shipped": 45,
    "total": 62
  },
  "inventory": {
    "lowStock": 8,    // items with stock < 5
    "outOfStock": 2
  },
  "topProducts": [
    { "id": "prod_1", "name": "...", "sold": 45, "revenue": 12825.00 }
  ]
}

// POST /api/admin/products
// Body
{
  "name": "Ankara Shirt - Blue",
  "slug": "ankara-shirt-blue",
  "description": "...",
  "price": 180.00,
  "comparePrice": 220.00,
  "categoryId": "cat_1",
  "images": ["url1", "url2"],
  "variants": [
    { "size": "S", "color": "Blue", "sku": "ANK-SH-BL-S", "stock": 10 },
    { "size": "M", "color": "Blue", "sku": "ANK-SH-BL-M", "stock": 15 }
  ],
  "isFeatured": true,
  "status": "published"
}
```

### 5.3 API Route Implementation Examples

#### Products List with Filtering

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  sort: z.enum(['newest', 'price-asc', 'price-desc', 'popular']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const query = querySchema.parse(searchParams)
    
    // Build where clause
    const where: any = {
      status: 'published',
    }
    
    if (query.category) {
      where.category = { slug: query.category }
    }
    
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ]
    }
    
    if (query.minPrice || query.maxPrice) {
      where.price = {}
      if (query.minPrice) where.price.gte = query.minPrice
      if (query.maxPrice) where.price.lte = query.maxPrice
    }
    
    if (query.size || query.color) {
      where.variants = {
        some: {
          ...(query.size && { size: query.size }),
          ...(query.color && { color: query.color }),
          stock: { gt: 0 },
        },
      }
    }
    
    // Build orderBy
    let orderBy: any = { createdAt: 'desc' }
    switch (query.sort) {
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'popular':
        orderBy = { orderItems: { _count: 'desc' } }
        break
    }
    
    // Execute query with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          category: true,
          variants: {
            where: { stock: { gt: 0 } },
          },
          reviews: {
            select: { rating: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ])
    
    // Transform response
    const transformedProducts = products.map((product) => ({
      ...product,
      averageRating:
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
          : null,
      reviewCount: product.reviews.length,
      reviews: undefined,
    }))
    
    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
```

#### Stripe Checkout Session

```typescript
// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  cartId: z.string(),
  shipping: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.object({
      line1: z.string().min(1),
      line2: z.string().optional(),
      city: z.string().min(1),
      state: z.string().min(1),
      postalCode: z.string().min(1),
      country: z.string().length(2),
    }),
  }),
  currency: z.enum(['USD', 'GBP', 'EUR', 'CAD']).default('USD'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = checkoutSchema.parse(body)
    
    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: data.cartId },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
        promoCode: true,
      },
    })
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    
    // Verify stock availability
    for (const item of cart.items) {
      if (item.quantity > item.variant.stock) {
        return NextResponse.json(
          { error: `${item.variant.product.name} (${item.variant.size}) is out of stock` },
          { status: 400 }
        )
      }
    }
    
    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    
    let discount = 0
    if (cart.promoCode) {
      if (cart.promoCode.type === 'percent') {
        discount = subtotal * (cart.promoCode.value / 100)
      } else {
        discount = cart.promoCode.value
      }
    }
    
    const shipping = 0 // Free shipping over $150 handled elsewhere
    const total = subtotal - discount + shipping
    
    // Create Stripe line items
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: data.currency.toLowerCase(),
        product_data: {
          name: item.variant.product.name,
          description: `Size: ${item.variant.size}, Color: ${item.variant.color}`,
          images: [item.variant.product.images[0]],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }))
    
    // Add discount as negative line item if applicable
    if (discount > 0) {
      lineItems.push({
        price_data: {
          currency: data.currency.toLowerCase(),
          product_data: {
            name: `Discount (${cart.promoCode?.code})`,
          },
          unit_amount: -Math.round(discount * 100),
        },
        quantity: 1,
      })
    }
    
    // Create pending order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ASA-${Date.now()}`,
        status: 'pending',
        subtotal,
        discount,
        shipping,
        total,
        currency: data.currency,
        shippingAddress: {
          create: {
            ...data.shipping.address,
            name: data.shipping.name,
            phone: data.shipping.phone,
          },
        },
        email: data.shipping.email,
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            productName: item.variant.product.name,
            variantName: `${item.variant.size} / ${item.variant.color}`,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          })),
        },
      },
    })
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: data.shipping.email,
      metadata: {
        orderId: order.id,
        cartId: cart.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL'],
      },
    })
    
    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

#### Stripe Webhook Handler

```typescript
// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/sendgrid'
import { fbPixel } from '@/lib/analytics'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const { orderId, cartId } = session.metadata!
      
      // Update order status
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'paid',
          stripePaymentId: session.payment_intent as string,
          paidAt: new Date(),
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      })
      
      // Decrement inventory
      for (const item of order.items) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: { decrement: item.quantity },
          },
        })
      }
      
      // Clear cart
      await prisma.cart.delete({ where: { id: cartId } })
      
      // Send confirmation email
      await sendOrderConfirmation({
        to: order.email,
        orderNumber: order.orderNumber,
        items: order.items,
        total: order.total,
        shippingAddress: order.shippingAddress,
      })
      
      // Track conversion (server-side)
      // Note: For FB CAPI, you'd send this to their server-side API
      console.log('Purchase completed:', {
        orderId: order.id,
        value: order.total,
        currency: order.currency,
      })
      
      break
    }
    
    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      const { orderId } = session.metadata!
      
      // Cancel the pending order
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'canceled' },
      })
      
      break
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error('Payment failed:', paymentIntent.id)
      // Handle failed payment (send email, etc.)
      break
    }
  }
  
  return NextResponse.json({ received: true })
}
```

### 5.4 Prisma Client Setup

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 5.5 SendGrid Email Setup

```typescript
// src/lib/sendgrid.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

interface OrderConfirmationParams {
  to: string
  orderNumber: string
  items: Array<{
    productName: string
    variantName: string
    quantity: number
    unitPrice: number
  }>
  total: number
  shippingAddress: {
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export async function sendOrderConfirmation(params: OrderConfirmationParams) {
  const { to, orderNumber, items, total, shippingAddress } = params
  
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          ${item.productName}<br>
          <small style="color: #666;">${item.variantName}</small>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          $${(item.unitPrice * item.quantity).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join('')
  
  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL!,
      name: 'ÀṢÀ Fashion',
    },
    subject: `Order Confirmed - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1A1A1A; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #D4A853; margin: 0;">ÀṢÀ</h1>
          <p style="color: #666; margin: 5px 0;">Premium African Fashion</p>
        </div>
        
        <div style="background: #F8F7F4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin-top: 0;">Thank you for your order!</h2>
          <p>We've received your order and are preparing it for shipment.</p>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
        </div>
        
        <h3>Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #6B2D3C; color: white;">
              <th style="padding: 12px; text-align: left;">Item</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 12px; text-align: right; font-weight: bold;">$${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <h3 style="margin-top: 30px;">Shipping Address</h3>
        <p style="background: #F8F7F4; padding: 15px; border-radius: 8px;">
          ${shippingAddress.name}<br>
          ${shippingAddress.line1}<br>
          ${shippingAddress.line2 ? shippingAddress.line2 + '<br>' : ''}
          ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
          ${shippingAddress.country}
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Questions? Reply to this email or contact us at support@asa-fashion.com
          </p>
        </div>
      </body>
      </html>
    `,
  }
  
  await sgMail.send(msg)
}

export async function sendShippingNotification(params: {
  to: string
  orderNumber: string
  trackingNumber: string
  carrier: string
}) {
  // Similar implementation for shipping notification
}

export async function sendLowStockAlert(params: {
  productName: string
  variantName: string
  currentStock: number
}) {
  // Alert to admin email
}
```

### 5.6 Admin Authentication Middleware

```typescript
// src/lib/admin-auth.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function requireAdmin() {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  
  // Check if user is admin
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  })
  
  if (dbUser?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  
  return { user }
}

// Usage in admin routes:
// export async function GET() {
//   const { user, error } = await requireAdmin()
//   if (error) return error
//   // ... admin logic
// }
```

---

## 6. Database Design

### 6.1 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER & AUTH
// ============================================

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  role          UserRole  @default(customer)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  addresses     Address[]
  orders        Order[]
  reviews       Review[]
  wishlistItems WishlistItem[]
  cart          Cart?
}

enum UserRole {
  customer
  admin
}

// ============================================
// PRODUCTS
// ============================================

model Category {
  id          String    @id @default(uuid())
  slug        String    @unique
  name        String
  description String?
  image       String?
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  products    Product[]
}

model Product {
  id            String    @id @default(uuid())
  slug          String    @unique
  name          String
  description   String
  price         Decimal   @db.Decimal(10, 2)
  comparePrice  Decimal?  @db.Decimal(10, 2)
  images        String[]
  isFeatured    Boolean   @default(false)
  status        ProductStatus @default(draft)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  categoryId    String
  category      Category  @relation(fields: [categoryId], references: [id])
  
  variants      ProductVariant[]
  reviews       Review[]
  wishlistItems WishlistItem[]
  
  @@index([categoryId])
  @@index([status])
}

enum ProductStatus {
  draft
  published
  archived
}

model ProductVariant {
  id        String   @id @default(uuid())
  size      String
  color     String
  sku       String   @unique
  stock     Int      @default(0)
  price     Decimal? @db.Decimal(10, 2)  // Override product price if set
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  cartItems  CartItem[]
  orderItems OrderItem[]
  
  @@unique([productId, size, color])
  @@index([productId])
  @@index([stock])
}

// ============================================
// SIZE GUIDE
// ============================================

model SizeGuide {
  id          String   @id @default(uuid())
  category    String   // "tops", "bottoms", "dresses"
  size        String   // "S", "M", "L", etc.
  bust        String?
  waist       String?
  hips        String?
  length      String?
  shoulders   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([category, size])
}

// ============================================
// CART
// ============================================

model Cart {
  id          String    @id @default(uuid())
  sessionId   String?   @unique  // For guest carts
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  userId      String?   @unique
  user        User?     @relation(fields: [userId], references: [id])
  
  promoCodeId String?
  promoCode   PromoCode? @relation(fields: [promoCodeId], references: [id])
  
  items       CartItem[]
}

model CartItem {
  id        String   @id @default(uuid())
  quantity  Int
  price     Decimal  @db.Decimal(10, 2)  // Price at time of adding
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  cartId    String
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  
  @@unique([cartId, variantId])
}

// ============================================
// ORDERS
// ============================================

model Order {
  id              String      @id @default(uuid())
  orderNumber     String      @unique
  status          OrderStatus @default(pending)
  email           String
  subtotal        Decimal     @db.Decimal(10, 2)
  discount        Decimal     @default(0) @db.Decimal(10, 2)
  shipping        Decimal     @default(0) @db.Decimal(10, 2)
  tax             Decimal     @default(0) @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  currency        String      @default("USD")
  stripePaymentId String?
  paidAt          DateTime?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  trackingNumber  String?
  trackingCarrier String?
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  userId          String?
  user            User?       @relation(fields: [userId], references: [id])
  
  shippingAddressId String
  shippingAddress   Address  @relation("ShippingAddress", fields: [shippingAddressId], references: [id])
  
  items           OrderItem[]
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

enum OrderStatus {
  pending
  paid
  processing
  shipped
  delivered
  canceled
  refunded
}

model OrderItem {
  id          String   @id @default(uuid())
  productName String
  variantName String
  quantity    Int
  unitPrice   Decimal  @db.Decimal(10, 2)
  totalPrice  Decimal  @db.Decimal(10, 2)
  createdAt   DateTime @default(now())
  
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  variantId   String
  variant     ProductVariant @relation(fields: [variantId], references: [id])
}

// ============================================
// ADDRESSES
// ============================================

model Address {
  id         String   @id @default(uuid())
  name       String
  phone      String?
  line1      String
  line2      String?
  city       String
  state      String
  postalCode String
  country    String
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  userId     String?
  user       User?    @relation(fields: [userId], references: [id])
  
  ordersShipping Order[] @relation("ShippingAddress")
  
  @@index([userId])
}

// ============================================
// PROMO CODES
// ============================================

model PromoCode {
  id             String   @id @default(uuid())
  code           String   @unique
  type           PromoType
  value          Decimal  @db.Decimal(10, 2)  // Percentage or fixed amount
  minOrderAmount Decimal? @db.Decimal(10, 2)
  maxUses        Int?
  usesCount      Int      @default(0)
  validFrom      DateTime @default(now())
  validUntil     DateTime?
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  carts          Cart[]
}

enum PromoType {
  percent
  fixed
}

// ============================================
// REVIEWS
// ============================================

model Review {
  id         String   @id @default(uuid())
  rating     Int      // 1-5
  title      String?
  body       String?
  isVerified Boolean  @default(false)  // User has purchased the product
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  
  productId  String
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
  @@index([productId])
}

// ============================================
// WISHLIST
// ============================================

model WishlistItem {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}
```

### 6.2 Database Migrations

```bash
# Create a new migration
pnpm prisma migrate dev --name add_reviews

# Apply migrations to production
pnpm prisma migrate deploy

# Reset database (development only!)
pnpm prisma migrate reset

# View database in browser
pnpm prisma studio
```

### 6.3 Seed Data

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const ankara = await prisma.category.create({
    data: {
      slug: 'ankara',
      name: 'Ankara Prints',
      description: 'Traditional African print clothing',
      sortOrder: 1,
    },
  })
  
  const casual = await prisma.category.create({
    data: {
      slug: 'casual',
      name: 'Casual Wear',
      description: 'Everyday comfort with African flair',
      sortOrder: 2,
    },
  })
  
  const accessories = await prisma.category.create({
    data: {
      slug: 'accessories',
      name: 'Accessories',
      description: 'Complete your look',
      sortOrder: 3,
    },
  })
  
  // Create sample product
  await prisma.product.create({
    data: {
      slug: 'ankara-blazer-gold',
      name: 'Ankara Blazer - Gold Pattern',
      description: 'A stunning tailored blazer featuring traditional Ankara print in rich gold tones. Perfect for making a statement at any occasion.',
      price: 285.00,
      comparePrice: 350.00,
      images: [
        'https://your-storage.com/products/blazer-gold-1.jpg',
        'https://your-storage.com/products/blazer-gold-2.jpg',
      ],
      isFeatured: true,
      status: 'published',
      categoryId: ankara.id,
      variants: {
        create: [
          { size: 'S', color: 'Gold', sku: 'ANK-BLZ-GLD-S', stock: 5 },
          { size: 'M', color: 'Gold', sku: 'ANK-BLZ-GLD-M', stock: 8 },
          { size: 'L', color: 'Gold', sku: 'ANK-BLZ-GLD-L', stock: 6 },
          { size: 'XL', color: 'Gold', sku: 'ANK-BLZ-GLD-XL', stock: 4 },
        ],
      },
    },
  })
  
  // Create size guide
  const sizeGuideData = [
    { category: 'tops', size: 'S', bust: '34"', waist: '26"', shoulders: '14"' },
    { category: 'tops', size: 'M', bust: '36"', waist: '28"', shoulders: '15"' },
    { category: 'tops', size: 'L', bust: '38"', waist: '30"', shoulders: '16"' },
    { category: 'tops', size: 'XL', bust: '40"', waist: '32"', shoulders: '17"' },
  ]
  
  for (const guide of sizeGuideData) {
    await prisma.sizeGuide.create({ data: guide })
  }
  
  // Create sample promo code
  await prisma.promoCode.create({
    data: {
      code: 'WELCOME15',
      type: 'percent',
      value: 15,
      minOrderAmount: 100,
      validUntil: new Date('2025-12-31'),
    },
  })
  
  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## 7. Third-Party Integrations

### 7.1 Stripe Configuration

```typescript
// src/lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

// Stripe product sync (for inventory)
export async function syncProductToStripe(product: {
  id: string
  name: string
  description: string
  images: string[]
}) {
  return stripe.products.create({
    id: product.id,
    name: product.name,
    description: product.description,
    images: product.images.slice(0, 8), // Stripe max 8 images
  })
}
```

### 7.2 Supabase Configuration

```typescript
// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Client-side Supabase client
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server-side Supabase client
export function createServerSupabase() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )
}

// Admin client for storage operations
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() { return undefined },
        set() {},
        remove() {},
      },
    }
  )
}
```

### 7.3 Image Upload to Supabase Storage

```typescript
// src/app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }
    
    const supabase = createAdminClient()
    const ext = file.name.split('.').pop()
    const filename = `products/${nanoid()}.${ext}`
    
    const { data, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filename, file, {
        cacheControl: '31536000', // 1 year
        upsert: false,
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
    
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path)
    
    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
```

---

## 8. Infrastructure & Deployment

### 8.1 Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "pnpm prisma generate && pnpm build",
  "framework": "nextjs",
  "regions": ["iad1"],  // US East, add more for global
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://asa-fashion.com"
  }
}
```

### 8.2 Environment Setup

**Development (.env.local)**
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
# ... other dev values
```

**Production (Vercel Dashboard)**
- Set all environment variables in Vercel project settings
- Use Vercel's integration with Supabase for automatic connection

### 8.3 Deployment Commands

```bash
# Deploy to Vercel (production)
vercel --prod

# Deploy preview
vercel

# View deployment logs
vercel logs

# Rollback deployment
vercel rollback
```

### 8.4 CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 9. Security Requirements

### 9.1 Authentication

- Supabase Auth with email/password
- JWT tokens with short expiry (1 hour)
- Secure HTTP-only cookies for session
- Rate limiting on auth endpoints (Vercel Edge)

### 9.2 Data Protection

| Requirement | Implementation |
|-------------|----------------|
| HTTPS | Enforced via Vercel (automatic) |
| PCI Compliance | Stripe handles all card data |
| Input Validation | Zod schemas on all API routes |
| SQL Injection | Prisma ORM (parameterized queries) |
| XSS Prevention | React escaping + CSP headers |
| CSRF Protection | SameSite cookies |

### 9.3 Security Headers

```typescript
// next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
]

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}
```

---

## 10. Performance Requirements

### 10.1 Core Web Vitals Targets

| Metric | Target | Impact |
|--------|--------|--------|
| LCP | < 2.5s | Page load perception |
| INP | < 200ms | Interactivity |
| CLS | < 0.1 | Visual stability |
| TTFB | < 200ms | Server response |

### 10.2 Optimization Strategies

- **Images**: Next.js Image component with WebP, lazy loading
- **Code Splitting**: Dynamic imports for admin, modals
- **Caching**: Vercel Edge Cache, Supabase cache
- **Database**: Proper indexing, connection pooling
- **Prefetching**: Next.js Link prefetch

---

## 11. Development Phases & Timeline

| Phase | Deliverables | Duration | Team |
|-------|--------------|----------|------|
| **Phase 1: Foundation** | Project setup, DB schema, auth, UI components | 2 weeks | 2 devs |
| **Phase 2: Core E-commerce** | Products, cart, checkout, Stripe | 3 weeks | 2-3 devs |
| **Phase 3: Admin** | Dashboard, product/order/inventory management | 2 weeks | 2 devs |
| **Phase 4: Features** | Reviews, wishlist, size guide, multi-currency | 2 weeks | 2 devs |
| **Phase 5: Polish** | Analytics, testing, performance, SEO | 2 weeks | Full team |
| **TOTAL MVP** | | **11 weeks** | |

---

## 12. Cost Estimation

### 12.1 Monthly Infrastructure

| Service | Low Est. | High Est. |
|---------|----------|-----------|
| Vercel Pro | $20 | $20 |
| Supabase Pro | $25 | $25 |
| SendGrid Essentials | $20 | $20 |
| Domain (annual/12) | $1 | $2 |
| **TOTAL** | **$66** | **$67** |

**Note**: This is well under your $200-500/month budget, leaving room for:
- Increased Supabase usage as you scale
- Additional services (Klaviyo, ShipStation when ready)
- Paid Vercel add-ons if needed

### 12.2 Transaction Costs

- **Stripe**: 2.9% + $0.30 per transaction
- At $10,000/month revenue: ~$320 in Stripe fees

---

## Appendix A: Useful Commands Reference

```bash
# ============================================
# DEVELOPMENT
# ============================================
pnpm dev                      # Start dev server
pnpm build                    # Build for production
pnpm start                    # Start production server
pnpm lint                     # Run ESLint
pnpm type-check               # TypeScript check

# ============================================
# DATABASE
# ============================================
pnpm prisma generate          # Generate Prisma client
pnpm prisma migrate dev       # Create & apply migration
pnpm prisma migrate deploy    # Apply migrations (prod)
pnpm prisma db seed           # Seed database
pnpm prisma studio            # Open database GUI

# ============================================
# TESTING
# ============================================
pnpm test                     # Run unit tests
pnpm test:e2e                 # Run E2E tests
pnpm test:coverage            # Coverage report

# ============================================
# DEPLOYMENT
# ============================================
vercel                        # Deploy preview
vercel --prod                 # Deploy production
vercel logs                   # View logs
vercel env pull               # Pull env vars locally

# ============================================
# UTILITIES
# ============================================
pnpm shadcn-ui add [component] # Add shadcn component
pnpm analyze                   # Bundle analyzer
```

---

## Appendix B: Environment Variables Checklist

```env
# ✅ Required for all environments
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# ✅ Required for analytics
NEXT_PUBLIC_FB_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=

# ⚙️ Optional
EXCHANGE_RATE_API_KEY=
```

---

*Document generated: March 2026*  
*For questions or updates, contact the development team.*
