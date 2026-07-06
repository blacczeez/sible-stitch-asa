'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SizeSelectorProps {
  sizes: string[]
  selectedSize: string | null
  onSelect: (size: string) => void
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-asa-charcoal">
          {selectedSize ? 'Size' : 'Select Size'}
        </span>
        {selectedSize && (
          <span className="text-sm font-semibold text-asa-gold">{selectedSize}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size

          return (
            <Button
              key={size}
              variant="outline"
              size="sm"
              onClick={() => onSelect(size)}
              aria-pressed={isSelected}
              className={cn(
                'min-w-12 transition-all',
                isSelected
                  ? 'border-2 border-asa-charcoal bg-asa-cream text-asa-charcoal font-semibold ring-2 ring-asa-gold ring-offset-2 shadow-sm hover:bg-asa-cream hover:text-asa-charcoal'
                  : 'border border-border/80 text-asa-charcoal/55 hover:border-asa-charcoal/35 hover:bg-background hover:text-asa-charcoal'
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
