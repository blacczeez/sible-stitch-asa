/* eslint-disable @typescript-eslint/no-explicit-any */

import { getPostHog } from '@/lib/posthog'

declare global {
  interface Window {
    fbq: (...args: any[]) => void
    ttq: {
      page: () => void
      track: (event: string, data?: Record<string, any>) => void
    }
  }
}

export type AnalyticsProduct = {
  id: string
  name: string
  price: number
  quantity?: number
  category?: string
  variant?: string
}

export type AnalyticsPurchase = {
  orderId: string
  orderNumber: string
  value: number
  currency: string
  items: Array<{
    id?: string
    name: string
    price: number
    quantity: number
  }>
}

// ---------------------------------------------------------------------------
// Facebook Pixel
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// TikTok Pixel
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// PostHog
// ---------------------------------------------------------------------------
export const posthogAnalytics = {
  /**
   * Identify a logged-in user.
   * WHERE: after Supabase auth succeeds (e.g. account layout / auth callback).
   * DATA: use the real Supabase user id + email — never invent IDs.
   */
  identify: (userId: string, traits?: { email?: string; name?: string }) => {
    const ph = getPostHog()
    if (!ph || !userId) return
    ph.identify(userId, traits)
  },

  reset: () => {
    getPostHog()?.reset()
  },

  viewContent: (product: AnalyticsProduct) => {
    getPostHog()?.capture('Product Viewed', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      category: product.category,
      currency: 'USD',
    })
  },

  addToCart: (product: AnalyticsProduct & { quantity: number }) => {
    getPostHog()?.capture('Product Added to Cart', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: product.quantity,
      variant: product.variant,
      category: product.category,
      value: product.price * product.quantity,
      currency: 'USD',
    })
  },

  initiateCheckout: (value: number, items: AnalyticsProduct[]) => {
    getPostHog()?.capture('Checkout Started', {
      value,
      currency: 'USD',
      item_count: items.reduce((sum, i) => sum + (i.quantity ?? 1), 0),
      products: items.map((i) => ({
        product_id: i.id,
        product_name: i.name,
        price: i.price,
        quantity: i.quantity ?? 1,
      })),
    })
  },

  purchase: (data: AnalyticsPurchase) => {
    getPostHog()?.capture('Order Completed', {
      order_id: data.orderId,
      order_number: data.orderNumber,
      value: data.value,
      currency: data.currency,
      item_count: data.items.reduce((sum, i) => sum + i.quantity, 0),
      products: data.items.map((i) => ({
        product_id: i.id,
        product_name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    })
  },
}

// ---------------------------------------------------------------------------
// Unified trackers — call these from UI; they fan out to all platforms.
// ---------------------------------------------------------------------------
export const analytics = {
  viewContent: (product: AnalyticsProduct) => {
    fbPixel.viewContent(product)
    tiktokPixel.viewContent(product)
    posthogAnalytics.viewContent(product)
  },

  addToCart: (product: AnalyticsProduct & { quantity: number }) => {
    fbPixel.addToCart(product)
    tiktokPixel.addToCart(product)
    posthogAnalytics.addToCart(product)
  },

  initiateCheckout: (value: number, items: AnalyticsProduct[]) => {
    fbPixel.initiateCheckout(
      value,
      items.map((i) => i.id)
    )
    posthogAnalytics.initiateCheckout(value, items)
  },

  purchase: (data: AnalyticsPurchase) => {
    fbPixel.purchase(
      data.orderId,
      data.value,
      data.items.map((i) => i.id || i.name)
    )
    tiktokPixel.purchase(data.orderId, data.value)
    posthogAnalytics.purchase(data)
  },

  identify: posthogAnalytics.identify,
  reset: posthogAnalytics.reset,
}
