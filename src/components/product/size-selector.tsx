'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ProductVariant } from '@/types'

interface SizeSelectorProps {
  sizes: string[]
  selectedSize: string | null
  onSelect: (size: string) => void
  variants: ProductVariant[]
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
  variants,
}: SizeSelectorProps) {
  function getStockForSize(size: string): number {
    return variants
      .filter((v) => v.size === size)
      .reduce((total, v) => total + v.stock, 0)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-asa-charcoal">Size</span>
        {selectedSize && (
          <span className="text-sm text-muted-foreground">{selectedSize}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const stock = getStockForSize(size)
          const isOutOfStock = stock === 0
          const isSelected = selectedSize === size

          return (
            <Button
              key={size}
              variant="outline"
              size="sm"
              disabled={isOutOfStock}
              onClick={() => onSelect(size)}
              className={cn(
                'min-w-[3rem] relative',
                isSelected &&
                  'border-asa-charcoal bg-asa-charcoal text-white hover:bg-asa-charcoal/90 hover:text-white',
                isOutOfStock && 'opacity-40 line-through'
              )}
            >
              {size}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
