'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types'
import { ProductCard } from '@/components/product/product-card'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const featured = products.slice(0, 8)

  function scroll(direction: 'left' | 'right') {
    if (!scrollRef.current) return
    const scrollAmount = 300
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-asa-gold mb-2">
              Curated Selection
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-asa-charcoal">
              Featured <span className="text-asa-gold mx-1">&diams;</span> Pieces
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-asa-charcoal transition-colors"
            >
              More products &rarr;
            </Link>
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        >
          {featured.map((product) => (
            <div key={product.id} className="snap-start flex-shrink-0 w-[220px] sm:w-[260px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:text-asa-charcoal transition-colors"
          >
            View all products &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
