'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { ShippingForm } from '@/components/checkout/shipping-form'
import { OrderReview } from '@/components/checkout/order-review'
import { CheckoutSkeleton } from '@/components/checkout/checkout-skeleton'

export function CheckoutContent() {
  const router = useRouter()
  const { items, hydrated } = useCart()

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.push('/cart')
    }
  }, [hydrated, items.length, router])

  if (!hydrated) {
    return <CheckoutSkeleton />
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 pb-12 sm:pb-16">
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
