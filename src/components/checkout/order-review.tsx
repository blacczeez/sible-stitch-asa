'use client'

import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/hooks/use-cart'
import { formatCurrency } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'

export function OrderReview() {
  const { items, subtotal, discount, promoCode } = useCart()

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15
  const total = subtotal - discount + shippingCost

  return (
    <div className="bg-white border rounded-lg p-6 sticky top-28">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-14 h-18 bg-muted rounded overflow-hidden flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                width={56}
                height={72}
                className="object-cover"
              />
              <span className="absolute -top-1 -right-1 bg-asa-charcoal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.size} / {item.color}
              </p>
            </div>
            <p className="text-sm font-medium">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({promoCode})</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
