'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Product } from '@/types'
import { ProductCard } from '@/components/product/product-card'
import { ProductFilters } from '@/components/product/product-filters'
import { ProductSort } from '@/components/product/product-sort'
import { ActiveFilters } from '@/components/product/active-filters'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { EmptyState } from '@/components/ui/empty-state'
import { Search } from 'lucide-react'

const ITEMS_PER_PAGE = 12

export function ProductListingContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort')
  const size = searchParams.get('size')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const page = parseInt(searchParams.get('page') || '1', 10)

  const [products, setProducts] = useState<Product[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)

  const queryKey = searchParams.toString()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const q = new URLSearchParams()
      if (category) q.set('category', category)
      if (search) q.set('search', search)
      if (sort) q.set('sort', sort)
      if (size) q.set('size', size)
      if (minPrice) q.set('minPrice', minPrice)
      if (maxPrice) q.set('maxPrice', maxPrice)
      q.set('page', String(page))
      q.set('limit', String(ITEMS_PER_PAGE))

      try {
        const res = await fetch(`/api/products?${q.toString()}`)
        const data = await res.json()
        if (!cancelled && res.ok) {
          setProducts(data.products ?? [])
          setTotalPages(data.pagination?.totalPages ?? 1)
          setTotalItems(data.pagination?.totalItems ?? 0)
        }
      } catch {
        if (!cancelled) {
          setProducts([])
          setTotalPages(1)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [queryKey, category, search, sort, size, minPrice, maxPrice, page])

  const categoryTitle = useMemo(() => {
    if (search) return `Search: "${search}"`
    if (category) {
      const match = products.find((p) => p.category.slug === category)
      return (
        match?.category.name ||
        category.charAt(0).toUpperCase() + category.slice(1)
      )
    }
    return 'All Products'
  }, [category, search, products])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-asa-charcoal">
          {categoryTitle}
        </h1>
        <p className="text-muted-foreground mt-1">
          {totalItems} product{totalItems !== 1 ? 's' : ''} found
        </p>
      </div>

      <ActiveFilters />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProductFilters />
        </aside>

        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <ProductSort />
          </div>

          {products.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No products found"
              description="Try adjusting your filters or search terms."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <PaginationControls currentPage={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
