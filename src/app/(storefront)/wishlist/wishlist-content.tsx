'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/product-card'
import { EmptyState } from '@/components/ui/empty-state'
import { useWishlist } from '@/hooks/use-wishlist'
import { mockProducts } from '@/lib/mock-data'

export function WishlistContent() {
  const { items } = useWishlist()

  const wishlistProducts = useMemo(
    () => mockProducts.filter((p) => items.includes(p.id)),
    [items]
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-asa-charcoal mb-8">
        My Wishlist
      </h1>

      {wishlistProducts.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love by clicking the heart icon on any product."
        >
          <Button asChild className="mt-4 bg-asa-charcoal">
            <Link href="/products">Browse Products</Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
