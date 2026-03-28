'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ColorSelectorProps {
  colors: string[]
  selectedColor: string | null
  onSelect: (color: string) => void
}

export function ColorSelector({
  colors,
  selectedColor,
  onSelect,
}: ColorSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-asa-charcoal">Color</span>
        {selectedColor && (
          <span className="text-sm text-muted-foreground">{selectedColor}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = selectedColor === color

          return (
            <Button
              key={color}
              variant="outline"
              size="sm"
              onClick={() => onSelect(color)}
              className={cn(
                'px-4',
                isSelected &&
                  'ring-2 ring-asa-gold ring-offset-2 border-asa-gold'
              )}
            >
              {color}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
