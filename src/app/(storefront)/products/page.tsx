import { Suspense } from 'react'
import { ProductListingContent } from './products-content'

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      }
    >
      <ProductListingContent />
    </Suspense>
  )
}
