'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  items: string[]
  hydrated: boolean
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,

      addItem: (productId) => {
        if (!get().items.includes(productId)) {
          set({ items: [...get().items, productId] })
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) })
      },

      toggleWishlist: (productId) => {
        if (get().items.includes(productId)) {
          get().removeItem(productId)
        } else {
          get().addItem(productId)
        }
      },

      isInWishlist: (productId) => {
        return get().items.includes(productId)
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'sible-wishlist',
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true
      },
    }
  )
)
