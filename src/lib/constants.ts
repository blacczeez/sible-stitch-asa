export const SUPPORTED_CURRENCIES = ['USD', 'GBP', 'EUR', 'CAD', 'NGN'] as const
export type Currency = (typeof SUPPORTED_CURRENCIES)[number]

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  GBP: '£',
  EUR: '€',
  CAD: 'C$',
  NGN: '₦',
}

export const DEFAULT_EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.36,
  NGN: 1550,
}

export const FREE_SHIPPING_THRESHOLD = 150
export const STANDARD_SHIPPING = 15
export const RETURN_WINDOW_DAYS = 30
export const MADE_TO_ORDER_LEAD_TIME = '2–3 weeks'
export const MAX_ORDER_QUANTITY = 10

export const MADE_TO_ORDER = {
  label: 'Made to Order',
  shortDescription: 'Each piece is crafted after you order',
  leadTime: `Ships in ${MADE_TO_ORDER_LEAD_TIME}`,
} as const

export const STOCK_THRESHOLDS = {
  LOW: 5,
  OUT: 0,
} as const

export const ITEMS_PER_PAGE = 12

export const BRAND = {
  name: 'Tivaram',
  tagline: 'Premium African-Inspired Fashion',
  email: 'support@tivaram.com',
  social: {
    instagram: 'https://instagram.com/tivaram',
    facebook: 'https://facebook.com/tivaram',
    tiktok: 'https://tiktok.com/@tivaram',
    twitter: 'https://twitter.com/tivaram',
  },
} as const

export const NAV_LINKS = [
  { label: 'Ankara Prints', href: '/products?category=ankara' },
  { label: 'Casual Wear', href: '/products?category=casual' },
  { label: 'Accessories', href: '/products?category=accessories' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Customer Stories', href: '/customer-reviews' },
] as const

export const QUICK_LINKS = [
  { label: 'Ankara Prints', href: '/products?category=ankara' },
  { label: 'Casual Wear', href: '/products?category=casual' },
  { label: 'Accessories', href: '/products?category=accessories' },
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Customer Stories', href: '/customer-reviews' },
] as const

export const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay'] as const
