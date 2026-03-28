'use client'

import { cn } from '@/lib/utils'
import { useCurrency } from '@/hooks/use-currency'

interface PriceDisplayProps {
  price: number
  comparePrice?: number | null
  className?: string
}

export function PriceDisplay({ price, comparePrice, className }: PriceDisplayProps) {
  const { format } = useCurrency()

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="font-semibold">{format(price)}</span>
      {comparePrice && comparePrice > price && (
        <span className="text-sm text-muted-foreground line-through">
          {format(comparePrice)}
        </span>
      )}
    </div>
  )
}
