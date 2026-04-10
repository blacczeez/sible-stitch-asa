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
  const { items, subtotal, discount, clearCart, promoCode } = useCart()
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
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          currency: 'USD',
          promoCode: promoCode ?? null,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Checkout failed')
      }

      const result = await res.json()

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else if (result.orderId) {
        clearCart()
        router.push(`/orders/${result.orderId}?success=true`)
      }
    } catch {
      router.push('/checkout?error=1')
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
