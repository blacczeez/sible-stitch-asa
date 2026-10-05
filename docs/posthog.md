# PostHog setup guide

PostHog is wired into the storefront for product analytics. Replace dummy config with your real project values, then verify events in the PostHog UI.

## 1. Replace dummy env vars (required)

In `.env.local` (or `.env`):

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_dummy_replace_me   # ← replace with Project API Key (phc_...)
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # ← or https://eu.i.posthog.com
```

| Variable | Where to get the real value |
|----------|-----------------------------|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog → **Project Settings** → **Project API Key** |
| `NEXT_PUBLIC_POSTHOG_HOST` | US cloud: `https://us.i.posthog.com` · EU cloud: `https://eu.i.posthog.com` · self-host: your instance URL |

The app **ignores** `phc_dummy_replace_me` and keys starting with `phc_your_` so placeholder keys never send traffic.

Restart `npm run dev` after changing env vars.

## 2. Events already wired (real product/order data)

These use live data from the DB / cart — you do **not** need to hardcode product IDs.

| Event | File | Data source |
|-------|------|-------------|
| `$pageview` | `src/components/analytics/posthog-provider.tsx` | Current pathname + search |
| `Product Viewed` | `src/app/(storefront)/products/[slug]/product-detail-content.tsx` | Product from Prisma |
| `Product Added to Cart` | `src/components/product/add-to-cart-button.tsx` | Product + selected variant |
| `Checkout Started` | `src/app/(storefront)/checkout/checkout-content.tsx` | Cart store line items + total |
| `Order Completed` | `src/app/(storefront)/orders/[id]/order-detail-content.tsx` | Order from DB when `?success=true` |

Call site for all platforms (PostHog + FB + TikTok): `src/lib/analytics.ts` → `analytics.*`

## 3. Where to add identify (logged-in users)

Not wired yet. After Supabase auth succeeds, call:

```ts
import { analytics } from '@/lib/analytics'

analytics.identify(user.id, { email: user.email ?? undefined })
```

**Suggested places:**
- Account layout / session bootstrap after `supabase.auth.getUser()`
- Auth callback / login success handler
- On logout: `analytics.reset()`

Use the **real Supabase user UUID** — never invent IDs.

## 4. Optional: more events you may want later

Add via `getPostHog()?.capture(...)` or extend `src/lib/analytics.ts`:

| Event idea | Suggested file |
|------------|----------------|
| Promo code applied | cart / promo UI |
| Search performed | search page / header |
| Wishlist / size guide opened | product page |
| Newsletter signup | footer form |
| Server-side purchase (Stripe webhook) | `src/app/api/webhooks/stripe` with `posthog-node` |

## 5. Verify

1. Set a real `NEXT_PUBLIC_POSTHOG_KEY`
2. Run the app, open a product, add to cart, go to checkout
3. PostHog → **Activity** / live events — you should see `$pageview`, `Product Viewed`, `Product Added to Cart`, `Checkout Started`
4. Complete a (test) order with `?success=true` — expect `Order Completed`

## 6. Notes

- `/admin/*` pageviews are excluded
- Dummy key = PostHog disabled (provider returns `null`)
- Do not send full shipping addresses or card data as event properties
- Keep currency consistent (`USD` today; pass `order.currency` on purchase)
