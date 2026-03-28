'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { ShippingAddress } from '@/validations/checkout'
import type { UseFormHandleSubmit } from 'react-hook-form'

interface CheckoutButtonProps {
  onSubmit: UseFormHandleSubmit<ShippingAddress>
}

export function CheckoutButton({ onSubmit }: CheckoutButtonProps) {
  const router = useRouter()
  const { items, subtotal, discount, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  const handleCheckout = onSubmit(async (data) => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping: data,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
          })),
          subtotal,
          discount,
        }),
      })

      const result = await res.json()

      if (result.checkoutUrl) {
        // Real Stripe checkout
        window.location.href = result.checkoutUrl
      } else if (result.orderId) {
        // Mock checkout redirect
        clearCart()
        router.push(`/orders/${result.orderId}?success=true`)
      }
    } catch {
      // Fallback: mock order
      clearCart()
      router.push('/orders/mock-order?success=true')
    } finally {
      setLoading(false)
    }
  })

  return (
    <Button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-asa-gold text-asa-charcoal hover:bg-asa-gold/90 font-semibold"
      size="lg"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" /> Processing...
        </span>
      ) : (
        'Place Order'
      )}
    </Button>
  )
}
