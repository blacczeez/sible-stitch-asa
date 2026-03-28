/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    fbq: (...args: any[]) => void
    ttq: {
      page: () => void
      track: (event: string, data?: Record<string, any>) => void
    }
  }
}

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
