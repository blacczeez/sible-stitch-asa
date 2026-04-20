'use client'

import { useTransition } from 'react'
import type { Product } from '@/types'
import { ProductCard } from '@/components/product/product-card'
import { ProductFilters } from '@/components/product/product-filters'
import { ProductSort } from '@/components/product/product-sort'
import { ActiveFilters } from '@/components/product/active-filters'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { EmptyState } from '@/components/ui/empty-state'
import { Search } from 'lucide-react'

interface ProductsViewProps {
  products: Product[]
  totalPages: number
  totalItems: number
  currentPage: number
  categoryTitle: string
}

export function ProductsView({
  products,
  totalPages,
  totalItems,
  currentPage,
  categoryTitle,
}: ProductsViewProps) {
  const [isPending] = useTransition()

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

          <div
            className="transition-opacity duration-200"
            style={{ opacity: isPending ? 0.6 : 1 }}
          >
            {products.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No products found"
                description="Try adjusting your filters or search terms."
              />
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <PaginationControls currentPage={currentPage} totalPages={totalPages} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
