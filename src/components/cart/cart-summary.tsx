'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PromoCodeInput } from '@/components/cart/promo-code-input'
import { useCart } from '@/hooks/use-cart'
import { formatCurrency } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

export function CartSummary() {
  const { subtotal, discount, total, promoCode } = useCart()

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15
  const finalTotal = total + shippingCost

  return (
    <div className="rounded-2xl bg-white/65 backdrop-blur-xl p-6 shadow-[0_8px_40px_-12px_rgba(26,23,20,0.12)] ring-1 ring-white/80 sticky top-(--storefront-header-offset) md:top-(--storefront-header-offset-md)">
      <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

      <PromoCodeInput />

      <div className="space-y-3 mt-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({promoCode})</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatCurrency(shippingCost)
            )}
          </span>
        </div>

        {subtotal < FREE_SHIPPING_THRESHOLD && (
          <p className="text-xs text-muted-foreground">
            Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for
            free shipping
          </p>
        )}

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatCurrency(finalTotal)}</span>
        </div>
      </div>

      <Button
        className="w-full mt-6 bg-asa-gold font-semibold text-asa-charcoal shadow-sm hover:bg-asa-gold/90 hover:text-asa-charcoal focus-visible:ring-asa-gold/40"
        size="lg"
        asChild
      >
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-3">
        Taxes calculated at checkout
      </p>
    </div>
  )
}
