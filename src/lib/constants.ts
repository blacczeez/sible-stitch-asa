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

export const STOCK_THRESHOLDS = {
  LOW: 5,
  OUT: 0,
} as const

export const ITEMS_PER_PAGE = 12

export const BRAND = {
  name: 'ÀṢÀ',
  tagline: 'Premium African-Inspired Fashion',
  email: 'support@asa-fashion.com',
  social: {
    instagram: 'https://instagram.com/asa_fashion',
    facebook: 'https://facebook.com/asafashion',
    tiktok: 'https://tiktok.com/@asa_fashion',
    twitter: 'https://twitter.com/asa_fashion',
  },
} as const

export const NAV_LINKS = [
  { label: 'Ankara Prints', href: '/products?category=ankara' },
  { label: 'Casual Wear', href: '/products?category=casual' },
  { label: 'Accessories', href: '/products?category=accessories' },
  { label: 'Size Guide', href: '/size-guide' },
] as const

export const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay'] as const
