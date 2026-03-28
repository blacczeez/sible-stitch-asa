'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { mockProducts } from '@/lib/mock-data'
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

  const filtered = useMemo(() => {
    let result = [...mockProducts]

    if (category) {
      result = result.filter((p) => p.category.slug === category)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }
    if (size) {
      result = result.filter((p) =>
        p.variants.some((v) => v.size === size && v.stock > 0)
      )
    }
    if (minPrice) {
      result = result.filter((p) => p.price >= parseFloat(minPrice))
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(maxPrice))
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }

    return result
  }, [category, search, sort, size, minPrice, maxPrice])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedProducts = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-asa-charcoal">
          {category
            ? mockProducts.find((p) => p.category.slug === category)?.category
                .name || 'Products'
            : search
            ? `Search: "${search}"`
            : 'All Products'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
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

          {paginatedProducts.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No products found"
              description="Try adjusting your filters or search terms."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
