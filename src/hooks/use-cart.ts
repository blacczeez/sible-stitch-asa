'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cart-store'

export function useCart() {
  const store = useCartStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  const itemCount = hydrated
    ? store.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0

  const subtotal = hydrated
    ? store.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0

  const total = subtotal - store.discount

  return {
    ...store,
    hydrated,
    itemCount,
    subtotal,
    total,
  }
}
