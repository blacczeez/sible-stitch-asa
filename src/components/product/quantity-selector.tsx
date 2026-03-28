'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (qty: number) => void
  max?: number
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  max = 99,
}: QuantitySelectorProps) {
  function decrement() {
    if (quantity > 1) {
      onQuantityChange(quantity - 1)
    }
  }

  function increment() {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-asa-charcoal">Quantity</span>
      <div className="flex items-center gap-0 border rounded-md w-fit">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={decrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
          className="rounded-r-none"
        >
          <Minus className="size-3.5" />
        </Button>
        <span className="w-10 text-center text-sm font-medium tabular-nums select-none">
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={increment}
          disabled={quantity >= max}
          aria-label="Increase quantity"
          className="rounded-l-none"
        >
          <Plus className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
