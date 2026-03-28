'use client'

import { create } from 'zustand'

interface UIStore {
  mobileMenuOpen: boolean
  searchOpen: boolean
  cartDrawerOpen: boolean

  setMobileMenuOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setCartDrawerOpen: (open: boolean) => void
  toggleCartDrawer: () => void
}

export const useUIStore = create<UIStore>()((set, get) => ({
  mobileMenuOpen: false,
  searchOpen: false,
  cartDrawerOpen: false,

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  toggleCartDrawer: () => set({ cartDrawerOpen: !get().cartDrawerOpen }),
}))
