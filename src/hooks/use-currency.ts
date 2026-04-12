'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SUPPORTED_CURRENCIES, DEFAULT_EXCHANGE_RATES, type Currency } from '@/lib/constants'

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
      currency: 'USD' as Currency,
      rates: { ...DEFAULT_EXCHANGE_RATES },

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
      name: 'sible-currency',
    }
  )
)

export { SUPPORTED_CURRENCIES }
export type { Currency }
