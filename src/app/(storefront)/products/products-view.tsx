'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Product } from '@/types'
import { ProductCard } from '@/components/product/product-card'
import { ProductFilters } from '@/components/product/product-filters'
import { ProductSort } from '@/components/product/product-sort'
import { ActiveFilters } from '@/components/product/active-filters'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface ProductsViewProps {
  products: Product[]
  totalPages: number
  totalItems: number
  categoryTitle: string
}

export function ProductsView({
  products: initialProducts,
  totalPages,
  totalItems,
  categoryTitle,
}: ProductsViewProps) {
  const searchParams = useSearchParams()
  const filterKey = (() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    return params.toString()
  })()

  const [items, setItems] = useState(initialProducts)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(totalPages > 1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    setItems(initialProducts)
    setPage(1)
    setHasMore(totalPages > 1)
    setLoadError(null)
  }, [initialProducts, totalPages, filterKey])

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return

    loadingRef.current = true
    setLoadingMore(true)
    setLoadError(null)

    const nextPage = page + 1
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    params.set('page', String(nextPage))

    try {
      const res = await fetch(`/api/products?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load more products')

      const data = (await res.json()) as {
        products: Product[]
        pagination: { hasMore: boolean }
      }

      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id))
        const next = data.products.filter((p) => !seen.has(p.id))
        return [...prev, ...next]
      })
      setPage(nextPage)
      setHasMore(Boolean(data.pagination?.hasMore))
    } catch {
      setLoadError('Could not load more products')
    } finally {
      loadingRef.current = false
      setLoadingMore(false)
    }
  }, [hasMore, page, searchParams])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void loadMore()
        }
      },
      { rootMargin: '240px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

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
        <aside className="w-full shrink-0 lg:sticky lg:w-64 lg:self-start lg:top-(--storefront-header-offset-md) lg:max-h-[calc(100vh-var(--storefront-header-offset-md)-1rem)] lg:overflow-y-auto">
          <ProductFilters />
        </aside>

        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <ProductSort />
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No products found"
              description="Try adjusting your filters or search terms."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} hoverSecondImage />
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center gap-3">
                {loadingMore && <LoadingSpinner size="md" />}
                {loadError && (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-muted-foreground">{loadError}</p>
                    <Button variant="outline" size="sm" onClick={() => void loadMore()}>
                      Try again
                    </Button>
                  </div>
                )}
                {hasMore && !loadError && (
                  <div ref={sentinelRef} className="h-8 w-full" aria-hidden />
                )}
                {!hasMore && items.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    You&apos;ve reached the end
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
