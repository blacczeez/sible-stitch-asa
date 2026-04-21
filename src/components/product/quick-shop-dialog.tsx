'use client'

import { useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Expand } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import { useUIStore } from '@/store/ui-store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/components/ui/price-display'
import { toast } from 'sonner'
import type { Product } from '@/types'

interface QuickShopDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickShopDialog({
  product,
  open,
  onOpenChange,
}: QuickShopDialogProps) {
  const addItem = useCartStore((s) => s.addItem)
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen)

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const sizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size))],
    [product.variants]
  )

  const colors = useMemo(
    () => [...new Set(product.variants.map((v) => v.color))],
    [product.variants]
  )

  // Auto-select color if only one exists
  const effectiveColor = colors.length === 1 ? colors[0] : selectedColor

  const selectedVariant = useMemo(() => {
    if (!selectedSize || !effectiveColor) return null
    return product.variants.find(
      (v) => v.size === selectedSize && v.color === effectiveColor
    )
  }, [product.variants, selectedSize, effectiveColor])

  function getStockForSize(size: string): number {
    return product.variants
      .filter((v) => v.size === size && (effectiveColor ? v.color === effectiveColor : true))
      .reduce((total, v) => total + v.stock, 0)
  }

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant) return

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      image: product.images[0] ?? '',
      price: selectedVariant.price ?? product.price,
      size: selectedVariant.size,
      color: selectedVariant.color,
      quantity: 1,
      slug: product.slug,
    })

    onOpenChange(false)
    setCartDrawerOpen(true)
    toast.success(`${product.name} added to cart`)

    // Reset selections for next open
    setSelectedSize(null)
    setSelectedColor(null)
  }, [selectedVariant, product, addItem, setCartDrawerOpen, onOpenChange])

  const isOutOfStock = selectedVariant?.stock === 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md p-0 gap-0 overflow-hidden max-h-[85vh] fixed bottom-0 left-0 right-0 top-auto translate-x-0 translate-y-0 sm:bottom-auto sm:left-[50%] sm:right-auto sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] rounded-t-2xl sm:rounded-2xl max-w-full data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:fade-in-0 sm:data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=closed]:fade-out-0 sm:data-[state=closed]:zoom-out-95"
        showCloseButton={false}
      >
        {/* Mobile drag indicator */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <DialogHeader className="sr-only">
          <DialogTitle>Quick Shop - {product.name}</DialogTitle>
          <DialogDescription>
            Select size and color for {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row">
          {/* Product Image */}
          <div className="relative w-full sm:w-2/5 aspect-square sm:aspect-[3/4] bg-asa-cream shrink-0">
            <Image
              src={product.images[0] ?? '/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 200px"
            />
          </div>

          {/* Selectors */}
          <div className="flex-1 p-5 flex flex-col gap-4">
            {/* Product Info */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-asa-gold">
                {product.category.name}
              </p>
              <h3 className="text-base font-serif font-medium text-asa-charcoal mt-1 line-clamp-2">
                {product.name}
              </h3>
              <div className="mt-1.5">
                <PriceDisplay
                  price={selectedVariant?.price ?? product.price}
                  comparePrice={product.comparePrice}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Color Selector - only if multiple colors */}
            {colors.length > 1 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-asa-charcoal">
                    Color
                  </span>
                  {selectedColor && (
                    <span className="text-xs text-muted-foreground">
                      {selectedColor}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'px-3 py-1.5 text-xs border rounded-full transition-all',
                        selectedColor === color
                          ? 'border-asa-gold ring-1 ring-asa-gold bg-asa-gold/5 font-medium'
                          : 'border-border hover:border-asa-charcoal/40'
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-asa-charcoal">
                  Size
                </span>
                {selectedSize && (
                  <span className="text-xs text-muted-foreground">
                    {selectedSize}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const stock = getStockForSize(size)
                  const outOfStock = stock === 0
                  const isSelected = selectedSize === size

                  return (
                    <button
                      key={size}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-[2.75rem] px-3 py-1.5 text-xs border rounded-full transition-all',
                        isSelected
                          ? 'border-asa-charcoal bg-asa-charcoal text-white font-medium'
                          : 'border-border hover:border-asa-charcoal/40',
                        outOfStock && 'opacity-30 line-through cursor-not-allowed'
                      )}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-auto pt-2">
              <Button
                className="w-full bg-asa-gold text-asa-charcoal hover:bg-asa-gold/90 rounded-full font-semibold h-11"
                onClick={handleAddToCart}
                disabled={!selectedVariant || isOutOfStock}
              >
                <ShoppingBag className="size-4" />
                {!selectedSize
                  ? 'Select a Size'
                  : colors.length > 1 && !selectedColor
                    ? 'Select a Color'
                    : isOutOfStock
                      ? 'Out of Stock'
                      : 'Add to Cart'}
              </Button>

              <Link
                href={`/products/${product.slug}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-asa-charcoal transition-colors py-2"
              >
                <Expand className="size-3" />
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
