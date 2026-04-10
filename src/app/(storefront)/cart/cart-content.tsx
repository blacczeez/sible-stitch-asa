'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { CartItemRow } from '@/components/cart/cart-item'
import { CartSummary } from '@/components/cart/cart-summary'
import { EmptyState } from '@/components/ui/empty-state'

export function CartContent() {
  const { items, hydrated } = useCart()

  if (!hydrated) {
    return (
      <div className="container mx-auto px-4 pb-16 text-center">
        <p className="text-muted-foreground">Loading cart...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 pb-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Looks like you haven't added any items to your bag yet."
        >
          <Button
            asChild
            className="mt-4 bg-asa-gold font-semibold text-asa-charcoal hover:bg-asa-gold/90 hover:text-asa-charcoal"
          >
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pb-12 sm:pb-16">
      <h1 className="text-3xl font-serif font-bold text-asa-charcoal mb-8">
        Shopping Bag
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  )
}
