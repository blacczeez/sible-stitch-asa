'use client'

import { mockProducts } from '@/lib/mock-data'
import { ProductCard } from '@/components/product/product-card'

export function FeaturedProducts() {
  const featured = mockProducts.filter((p) => p.isFeatured).slice(0, 4)

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-asa-charcoal mb-2">
          Featured Pieces
        </h2>
        <p className="text-muted-foreground">
          Handpicked favorites from our latest collection
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
