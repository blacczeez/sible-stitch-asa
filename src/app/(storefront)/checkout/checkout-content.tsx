'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { ShippingForm } from '@/components/checkout/shipping-form'
import { OrderReview } from '@/components/checkout/order-review'

export function CheckoutContent() {
  const router = useRouter()
  const { items, hydrated } = useCart()

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.push('/cart')
    }
  }, [hydrated, items.length, router])

  if (!hydrated || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-asa-charcoal mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ShippingForm />
        </div>
        <div>
          <OrderReview />
        </div>
      </div>
    </div>
  )
}
