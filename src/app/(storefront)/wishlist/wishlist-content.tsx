'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/product-card'
import { EmptyState } from '@/components/ui/empty-state'
import { useWishlist } from '@/hooks/use-wishlist'
import type { Product } from '@/types'

export function WishlistContent() {
  const { items } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (items.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const q = new URLSearchParams()
        q.set('ids', items.join(','))
        q.set('limit', '50')
        q.set('page', '1')
        const res = await fetch(`/api/products?${q.toString()}`)
        const data = await res.json()
        if (!cancelled && res.ok) {
          setProducts(data.products ?? [])
        }
      } catch {
        if (!cancelled) setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [items])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-asa-charcoal mb-8">
          My Wishlist
        </h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-asa-charcoal mb-8">
        My Wishlist
      </h1>

      {products.length === 0 ? (
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
