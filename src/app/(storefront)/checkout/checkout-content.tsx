'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { ShippingForm } from '@/components/checkout/shipping-form'
import { OrderReview } from '@/components/checkout/order-review'
import { CheckoutSkeleton } from '@/components/checkout/checkout-skeleton'
import { analytics } from '@/lib/analytics'

export function CheckoutContent() {
  const router = useRouter()
  const { items, hydrated, total } = useCart()
  const checkoutTracked = useRef(false)

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.push('/cart')
    }
  }, [hydrated, items.length, router])

  // Analytics: Checkout Started — once per visit when cart has real line items
  useEffect(() => {
    if (!hydrated || items.length === 0 || checkoutTracked.current) return
    checkoutTracked.current = true
    analytics.initiateCheckout(
      total,
      items.map((i) => ({
        id: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        variant: `${i.size} / ${i.color}`,
      }))
    )
  }, [hydrated, items, total])

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
