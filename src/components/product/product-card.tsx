'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/hooks/use-wishlist'
import { useCartStore } from '@/store/cart-store'
import { useUIStore } from '@/store/ui-store'
import { PriceDisplay } from '@/components/ui/price-display'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const addItem = useCartStore((s) => s.addItem)
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen)
  const wishlisted = isInWishlist(product.id)

  const defaultVariant = product.variants.find((v) => v.stock > 0)

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!defaultVariant) {
      toast.error('This product is currently out of stock.')
      return
    }

    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      image: product.images[0] ?? '',
      price: defaultVariant.price ?? product.price,
      size: defaultVariant.size,
      color: defaultVariant.color,
      quantity: 1,
      slug: product.slug,
    })

    setCartDrawerOpen(true)
    toast.success(`${product.name} added to cart`)
  }

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  return (
    <div className="group relative">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-asa-cream">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0] ?? '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 size-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={cn(
              'size-4 transition-colors',
              wishlisted
                ? 'fill-asa-wine text-asa-wine'
                : 'text-asa-charcoal'
            )}
          />
        </Button>

        {/* Quick Add Button */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
          <Button
            className="w-full bg-asa-charcoal text-white hover:bg-asa-charcoal/90"
            size="sm"
            onClick={handleQuickAdd}
            disabled={!defaultVariant}
          >
            <ShoppingBag className="size-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-3 space-y-1">
        <Link
          href={`/products/${product.slug}`}
          className="block text-sm font-medium text-asa-charcoal hover:text-asa-wine transition-colors line-clamp-1"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted-foreground">{product.category.name}</p>
        <PriceDisplay
          price={product.price}
          comparePrice={product.comparePrice}
          className="text-sm"
        />
      </div>
    </div>
  )
}
