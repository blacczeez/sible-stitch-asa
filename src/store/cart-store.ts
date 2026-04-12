'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  promoCode: string | null
  discount: number

  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  applyPromoCode: (code: string) => Promise<boolean>
  clearPromo: () => void
  clearCart: () => void
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
        try {
          const subtotal = get().items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )
          const res = await fetch('/api/promo-codes/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, subtotal }),
          })
          const data = await res.json()

          if (data.valid) {
            set({ promoCode: code, discount: data.discount })
            return true
          }
          return false
        } catch {
          return false
        }
      },

      clearPromo: () => {
        set({ promoCode: null, discount: 0 })
      },

      clearCart: () => {
        set({ items: [], promoCode: null, discount: 0 })
      },
    }),
    {
      name: 'sible-cart',
    }
  )
)
