# ASA E-Commerce Implementation Plan

## Phase 1: Project Foundation (Tasks 1-5)

### Task 1: Initialize Next.js Project & Dependencies
**Steps:**
1. Create Next.js 14 project with TypeScript, Tailwind CSS, App Router, pnpm
2. Install core dependencies:
   - `prisma @prisma/client` (ORM)
   - `zustand` (state management)
   - `react-hook-form @hookform/resolvers zod` (forms/validation)
   - `@supabase/supabase-js @supabase/ssr` (auth/storage)
   - `stripe @stripe/stripe-js` (payments)
   - `@sendgrid/mail` (email)
   - `lucide-react` (icons)
   - `nanoid` (ID generation)
3. Initialize shadcn/ui with brand theme colors
4. Create `.env.example` with all required environment variables
5. Create `next.config.js` with security headers and image domains
6. Create `tailwind.config.ts` with brand colors and custom fonts
7. Set up the directory structure per PRD (src/components, lib, hooks, store, types, validations)

**Verification:** `pnpm dev` starts without errors

### Task 2: Database Schema & Prisma Setup
**Steps:**
1. Initialize Prisma: `npx prisma init`
2. Create `prisma/schema.prisma` with full schema from PRD section 6.1:
   - User, Category, Product, ProductVariant, SizeGuide
   - Cart, CartItem, Order, OrderItem, Address
   - PromoCode, Review, WishlistItem
   - All enums: UserRole, ProductStatus, OrderStatus, PromoType
3. Create `src/lib/prisma.ts` (singleton client)
4. Create seed file `prisma/seed.ts` with:
   - 3 categories (Ankara, Casual, Accessories)
   - 8-10 sample products with variants
   - Size guide data
   - WELCOME15 promo code
   - Admin user
5. Add seed script to `package.json`

**Verification:** `pnpm prisma validate` passes, schema compiles

### Task 3: Core Library Setup
**Steps:**
1. Create `src/lib/supabase.ts` - browser client, server client, admin client
2. Create `src/lib/stripe.ts` - Stripe instance configuration
3. Create `src/lib/sendgrid.ts` - SendGrid setup with email templates (order confirmation, shipping notification)
4. Create `src/lib/utils.ts` - formatCurrency, cn (classnames), slugify, generateOrderNumber
5. Create `src/lib/constants.ts` - supported currencies, shipping thresholds, product statuses
6. Create `src/lib/analytics.ts` - Facebook Pixel + TikTok Pixel helpers

**Verification:** TypeScript compiles with no errors

### Task 4: TypeScript Types & Zod Validations
**Steps:**
1. Create `src/types/product.ts` - Product, ProductVariant, Category types
2. Create `src/types/order.ts` - Order, OrderItem, Address types
3. Create `src/types/cart.ts` - Cart, CartItem types
4. Create `src/types/index.ts` - re-export all types
5. Create `src/validations/product.ts` - product query schema, create/update schemas
6. Create `src/validations/checkout.ts` - shipping address, checkout session schemas
7. Create `src/validations/admin.ts` - admin product, promo code, order update schemas

**Verification:** TypeScript compiles with no errors

### Task 5: Zustand Stores & Custom Hooks
**Steps:**
1. Create `src/store/cart-store.ts` - cart state with persist middleware (add, remove, update quantity, promo code, computed totals)
2. Create `src/store/ui-store.ts` - mobile menu, search modal, cart drawer states
3. Create `src/hooks/use-cart.ts` - wrapper hook for cart store
4. Create `src/hooks/use-wishlist.ts` - wishlist state (localStorage backed)
5. Create `src/hooks/use-currency.ts` - multi-currency store with conversion & formatting

**Verification:** TypeScript compiles with no errors

---

## Phase 2: Layout & Core UI Components (Tasks 6-8)

### Task 6: Root Layout, Global Styles & Base UI Components
**Steps:**
1. Install shadcn/ui base components: button, input, select, dialog, sheet, dropdown-menu, badge, skeleton, toast, separator, card, avatar, label, textarea, table, tabs, checkbox, radio-group, scroll-area, popover, command
2. Create `src/app/globals.css` with brand CSS variables and custom fonts
3. Create `src/app/layout.tsx` root layout with:
   - HTML lang, meta tags, fonts
   - Analytics pixel scripts (FB, TikTok)
   - Toast provider
   - Metadata (title, description, OpenGraph)
4. Create `src/app/(storefront)/layout.tsx` with Header + Footer

**Verification:** `pnpm dev` renders the layout shell

### Task 7: Header & Navigation Components
**Steps:**
1. Create `src/components/layout/header.tsx`:
   - Announcement bar (free shipping promo)
   - Logo (ASA in brand gold)
   - Desktop nav: Ankara Prints, Casual Wear, Accessories, Size Guide
   - Search button, Wishlist icon, Cart icon with badge
   - Mobile hamburger menu
2. Create `src/components/layout/mobile-nav.tsx` - Sheet/drawer mobile navigation
3. Create `src/components/layout/search-dialog.tsx` - Command palette search
4. Create `src/components/layout/cart-drawer.tsx` - Slide-out mini cart
5. Create `src/components/layout/currency-selector.tsx` - Dropdown for USD/GBP/EUR/CAD/NGN

**Verification:** Header renders responsively at mobile/tablet/desktop breakpoints

### Task 8: Footer & Shared Components
**Steps:**
1. Create `src/components/layout/footer.tsx`:
   - Brand logo + description
   - Links: Shop, Customer Service, Company
   - Social media links
   - Payment method icons
   - Copyright
2. Create `src/components/layout/announcement-bar.tsx` - Reusable top bar
3. Create `src/components/ui/loading-spinner.tsx`
4. Create `src/components/ui/empty-state.tsx`
5. Create `src/components/ui/price-display.tsx` - Handles multi-currency + compare price strikethrough
6. Create `src/components/ui/rating-stars.tsx` - Star rating display component
7. Create `src/components/ui/pagination.tsx` - Reusable pagination component

**Verification:** Footer renders, all shared components are importable

---

## Phase 3: Product Catalog (Tasks 9-12)

### Task 9: Products API Routes
**Steps:**
1. Create `src/app/api/products/route.ts` - GET with filtering (category, search, price range, size, color, sort, pagination)
2. Create `src/app/api/products/[slug]/route.ts` - GET single product with variants, reviews, related products
3. Create `src/app/api/reviews/route.ts` - GET reviews for product, POST new review

**Verification:** API routes return correct JSON responses (test with curl or browser)

### Task 10: Homepage
**Steps:**
1. Create `src/app/(storefront)/page.tsx`:
   - Hero section with CTA (full-width image, headline, shop button)
   - Featured products grid (4 items)
   - Category showcase (3 cards: Ankara, Casual, Accessories)
   - "Why ASA" value props section
   - Newsletter signup
2. Create `src/components/product/product-card.tsx` - Product card with image, name, price, wishlist button, quick-add hover
3. Create `src/components/product/product-grid.tsx` - Responsive grid wrapper

**Verification:** Homepage renders with layout, hero, category cards

### Task 11: Product Listing Page
**Steps:**
1. Create `src/app/(storefront)/products/page.tsx`:
   - Server-side data fetching with search params
   - Product grid with ProductCard components
   - Sidebar filters (category, price range, size, color)
   - Sort dropdown (Newest, Price low-high, Price high-low, Popular)
   - Pagination
   - Loading skeletons
2. Create `src/components/product/product-filters.tsx` - Filter sidebar/drawer
3. Create `src/components/product/product-sort.tsx` - Sort dropdown
4. Create `src/components/product/active-filters.tsx` - Active filter badges with remove

**Verification:** Product listing renders, filters update URL params and re-fetch

### Task 12: Product Detail Page
**Steps:**
1. Create `src/app/(storefront)/products/[slug]/page.tsx`:
   - Image gallery with thumbnails (main image + gallery)
   - Product info (name, price, compare price, rating)
   - Size selector with availability indicators
   - Color selector
   - Quantity selector
   - Add to Cart button
   - Product description (expandable)
   - Size guide link
   - Reviews section
2. Create `src/components/product/image-gallery.tsx` - Main image + thumbnail navigation
3. Create `src/components/product/size-selector.tsx` - Size buttons with stock status
4. Create `src/components/product/color-selector.tsx` - Color swatches
5. Create `src/components/product/review-list.tsx` - Reviews with rating filter
6. Create `src/components/product/review-form.tsx` - Add review form
7. Generate dynamic metadata for SEO (title, description, OpenGraph image)

**Verification:** Product detail page renders with all sections, add-to-cart works with store

---

## Phase 4: Cart & Checkout (Tasks 13-16)

### Task 13: Cart API & Page
**Steps:**
1. Create `src/app/api/cart/route.ts` - GET cart, POST add item
2. Create `src/app/api/cart/items/[id]/route.ts` - PATCH update quantity, DELETE remove item
3. Create `src/app/api/promo-codes/validate/route.ts` - POST validate promo code
4. Create `src/app/(storefront)/cart/page.tsx`:
   - Cart item list with image, name, variant, price, quantity controls, remove
   - Promo code input with apply button
   - Order summary (subtotal, discount, shipping, total)
   - Continue to Checkout button
   - Empty cart state with CTA
5. Create `src/components/cart/cart-item.tsx`
6. Create `src/components/cart/cart-summary.tsx`
7. Create `src/components/cart/promo-code-input.tsx`

**Verification:** Cart page renders, items can be added/removed/updated, promo code validates

### Task 14: Checkout Flow
**Steps:**
1. Create `src/app/api/checkout/route.ts` - POST create Stripe checkout session
2. Create `src/app/(storefront)/checkout/page.tsx`:
   - Shipping information form (name, email, phone, address)
   - Order summary sidebar
   - Pay with Stripe button (redirects to Stripe Checkout)
3. Create `src/components/checkout/shipping-form.tsx` - Address form with react-hook-form + zod
4. Create `src/components/checkout/order-review.tsx` - Mini order summary

**Verification:** Checkout form validates, creates Stripe session, redirects to Stripe

### Task 15: Stripe Webhook & Order Completion
**Steps:**
1. Create `src/app/api/webhooks/stripe/route.ts`:
   - Verify webhook signature
   - Handle checkout.session.completed: update order status, decrement inventory, clear cart, send confirmation email
   - Handle checkout.session.expired: cancel pending order
   - Handle payment_intent.payment_failed: log error
2. Create `src/app/(storefront)/orders/[id]/page.tsx` - Order confirmation page:
   - Success banner
   - Order number and details
   - Items ordered
   - Shipping address
   - Order status timeline

**Verification:** Webhook processes events correctly (test with Stripe CLI)

### Task 16: Wishlist & Size Guide Pages
**Steps:**
1. Create `src/app/api/wishlist/route.ts` - GET, POST wishlist
2. Create `src/app/api/wishlist/[productId]/route.ts` - DELETE from wishlist
3. Create `src/app/(storefront)/wishlist/page.tsx` - Wishlist grid with product cards, move to cart action
4. Create `src/app/(storefront)/size-guide/page.tsx`:
   - Size chart tables by category (tops, bottoms, dresses)
   - Measurement instructions with diagrams
   - Fit tips

**Verification:** Wishlist add/remove works, size guide page renders tables

---

## Phase 5: Admin Dashboard (Tasks 17-22)

### Task 17: Admin Layout & Auth
**Steps:**
1. Create `src/lib/admin-auth.ts` - requireAdmin middleware using Supabase Auth + Prisma role check
2. Create `src/app/(admin)/admin/layout.tsx`:
   - Sidebar navigation (Dashboard, Products, Orders, Customers, Promo Codes, Inventory)
   - Top bar with admin name, logout
   - Protected route (redirect to login if not admin)
3. Create `src/components/admin/admin-sidebar.tsx`
4. Create `src/components/admin/admin-header.tsx`
5. Create `src/app/(admin)/admin/login/page.tsx` - Admin login form

**Verification:** Admin layout renders, non-admin users redirected

### Task 18: Admin Dashboard Home
**Steps:**
1. Create `src/app/api/admin/dashboard/route.ts` - GET dashboard stats (revenue, orders, inventory, top products)
2. Create `src/app/(admin)/admin/page.tsx`:
   - Revenue cards (today, this week, this month, growth %)
   - Order status overview (pending, processing, shipped)
   - Low stock alerts
   - Recent orders table
   - Top selling products chart/list

**Verification:** Dashboard shows stats from API

### Task 19: Admin Product Management
**Steps:**
1. Create `src/app/api/admin/products/route.ts` - GET list, POST create
2. Create `src/app/api/admin/products/[id]/route.ts` - GET, PATCH, DELETE
3. Create `src/app/api/admin/upload/route.ts` - POST image upload to Supabase Storage
4. Create `src/app/(admin)/admin/products/page.tsx` - Products table with search, filter by status, pagination
5. Create `src/app/(admin)/admin/products/new/page.tsx` - Create product form
6. Create `src/app/(admin)/admin/products/[id]/edit/page.tsx` - Edit product form
7. Create `src/components/admin/product-form.tsx` - Shared form: name, slug, description, price, compare price, category, images upload, variants manager, status
8. Create `src/components/admin/image-upload.tsx` - Drag & drop image upload to Supabase Storage
9. Create `src/components/admin/variant-manager.tsx` - Add/edit/remove product variants (size, color, SKU, stock)

**Verification:** CRUD products works, images upload to Supabase

### Task 20: Admin Order Management
**Steps:**
1. Create `src/app/api/admin/orders/route.ts` - GET orders with filtering/pagination
2. Create `src/app/api/admin/orders/[id]/route.ts` - GET detail, PATCH update status/tracking
3. Create `src/app/(admin)/admin/orders/page.tsx` - Orders table with status filter, date filter, search by order number
4. Create `src/app/(admin)/admin/orders/[id]/page.tsx` - Order detail:
   - Customer info
   - Items ordered
   - Shipping address
   - Status timeline
   - Update status dropdown
   - Add tracking number
   - Order notes

**Verification:** Orders list/filter/update works

### Task 21: Admin Promo Codes & Customers
**Steps:**
1. Create `src/app/api/admin/promo-codes/route.ts` - GET list, POST create
2. Create `src/app/api/admin/promo-codes/[id]/route.ts` - PATCH, DELETE
3. Create `src/app/(admin)/admin/promo-codes/page.tsx` - Promo codes table with create dialog
4. Create `src/components/admin/promo-code-form.tsx` - Create/edit form: code, type (percent/fixed), value, min order, max uses, dates, active toggle
5. Create `src/app/api/admin/customers/route.ts` - GET customers with order history
6. Create `src/app/(admin)/admin/customers/page.tsx` - Customers table with search, order count, total spent

**Verification:** CRUD promo codes works, customers list renders

### Task 22: Admin Inventory Management
**Steps:**
1. Create `src/app/api/admin/inventory/route.ts` - GET inventory overview, PATCH update stock
2. Create `src/app/(admin)/admin/inventory/page.tsx`:
   - Inventory table: product name, variant, SKU, current stock, status
   - Low stock filter (< 5 units)
   - Out of stock filter
   - Bulk stock update
   - Stock adjustment (add/subtract with reason)

**Verification:** Inventory table renders, stock updates work

---

## Phase 6: Polish & Production (Tasks 23-25)

### Task 23: Analytics & SEO
**Steps:**
1. Add Facebook Pixel initialization to root layout
2. Add TikTok Pixel initialization to root layout
3. Wire up pixel events: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase
4. Add dynamic metadata to all pages (title, description, OpenGraph)
5. Create `src/app/sitemap.ts` - Dynamic sitemap generation
6. Create `src/app/robots.ts` - Robots.txt
7. Add structured data (JSON-LD) for products

**Verification:** Pixels fire on page navigation (check browser console), meta tags render

### Task 24: Performance & Loading States
**Steps:**
1. Add loading.tsx files for key routes (products, product detail, cart, admin pages)
2. Add error.tsx files for error boundaries
3. Add not-found.tsx for 404 pages
4. Optimize images: ensure all use Next.js Image with proper sizes/priority
5. Add Suspense boundaries around dynamic content
6. Verify Lighthouse scores > 90

**Verification:** Loading states show during navigation, error pages render

### Task 25: Email Templates & Final Integration
**Steps:**
1. Complete SendGrid order confirmation email template
2. Create shipping notification email template
3. Create low stock alert email (sent to admin)
4. Test full purchase flow end-to-end:
   - Browse products -> Add to cart -> Apply promo -> Checkout -> Stripe payment -> Order confirmation email
5. Test admin flow:
   - Login -> Add product -> Update inventory -> Process order -> Update tracking

**Verification:** Full end-to-end flow works
