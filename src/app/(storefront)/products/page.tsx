import { Suspense } from 'react'
import { ProductListingContent } from './products-content'
import { ProductsSkeleton } from './products-skeleton'

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductListingContent />
    </Suspense>
  )
}
