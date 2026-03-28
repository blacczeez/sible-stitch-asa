'use client'

import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useUIStore } from '@/store/ui-store'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { Product, ProductVariant } from '@/types'

interface AddToCartButtonProps {
  product: Product
  selectedVariant: ProductVariant | null | undefined
  quantity: number
}

export function AddToCartButton({
  product,
  selectedVariant,
  quantity,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen)

  function handleAddToCart() {
    if (!selectedVariant) return

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      image: product.images[0] || '',
      price: selectedVariant.price ?? product.price,
      size: selectedVariant.size,
      color: selectedVariant.color,
      quantity,
      slug: product.slug,
    })

    setCartDrawerOpen(true)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Button
      className="w-full bg-asa-charcoal text-white hover:bg-asa-charcoal/90"
      size="lg"
      onClick={handleAddToCart}
      disabled={!selectedVariant}
    >
      <ShoppingBag className="size-4" />
      {selectedVariant ? 'Add to Cart' : 'Select a Size'}
    </Button>
  )
}
