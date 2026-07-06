'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Product, Review } from '@/types'
import { ImageGallery } from '@/components/product/image-gallery'
import { SizeSelector } from '@/components/product/size-selector'
import { ColorSelector } from '@/components/product/color-selector'
import { QuantitySelector } from '@/components/product/quantity-selector'
import { AddToCartButton } from '@/components/product/add-to-cart-button'
import { ReviewList } from '@/components/product/review-list'
import { ReviewForm } from '@/components/product/review-form'
import { RelatedProducts } from '@/components/product/related-products'
import { SizeGuideModal } from '@/components/size-guide/size-guide-modal'
import { PriceDisplay } from '@/components/ui/price-display'
import { RatingStars } from '@/components/ui/rating-stars'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Truck, RotateCcw, Scissors, Users } from 'lucide-react'
import { MADE_TO_ORDER, FREE_SHIPPING_THRESHOLD, MAX_ORDER_QUANTITY } from '@/lib/constants'

interface ProductDetailContentProps {
  product: Product
  initialReviews: Review[]
  relatedProducts: Product[]
}

export function ProductDetailContent({
  product,
  initialReviews,
  relatedProducts,
}: ProductDetailContentProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)

  const sizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size))],
    [product]
  )
  const colors = useMemo(
    () => [...new Set(product.variants.map((v) => v.color))],
    [product]
  )

  useEffect(() => {
    if (colors.length === 1 && !selectedColor) {
      setSelectedColor(colors[0])
    }
  }, [colors, selectedColor])

  const selectedVariant = useMemo(() => {
    if (!selectedSize || !selectedColor) return null
    return product.variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    )
  }, [product, selectedSize, selectedColor])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ImageGallery images={product.images} />

        <div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">
              {product.category.name}
            </p>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-asa-charcoal">
              {product.name}
            </h1>
          </div>

          {product.averageRating != null && (
            <div className="flex items-center gap-2 mb-4">
              <RatingStars rating={product.averageRating} />
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          <PriceDisplay
            price={product.price}
            comparePrice={product.comparePrice}
            className="text-xl mb-6"
          />

          {product.comparePrice && product.comparePrice > product.price && (
            <Badge variant="secondary" className="mb-4 bg-asa-terracotta/10 text-asa-terracotta">
              Save{' '}
              {Math.round(
                ((product.comparePrice - product.price) / product.comparePrice) * 100
              )}
              %
            </Badge>
          )}

          <p className="text-muted-foreground mb-6">{product.description}</p>

          <Separator className="my-6" />

          {colors.length > 1 && (
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Color</label>
              <ColorSelector
                colors={colors}
                selectedColor={selectedColor}
                onSelect={setSelectedColor}
              />
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Size</label>
              <SizeGuideModal
                trigger={
                  <button
                    type="button"
                    className="text-sm text-asa-gold underline underline-offset-2 hover:text-asa-gold/80"
                  >
                    Checkout Size Guide
                  </button>
                }
              />
            </div>
            <SizeSelector
              sizes={sizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />
          </div>

          <div className="mb-6">
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              max={MAX_ORDER_QUANTITY}
            />
          </div>

          <AddToCartButton
            product={product}
            selectedVariant={selectedVariant}
            quantity={quantity}
          />

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Scissors className="w-4 h-4 shrink-0" />
              <span>
                {MADE_TO_ORDER.label} — {MADE_TO_ORDER.leadTime.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Truck className="w-4 h-4 shrink-0" />
              <span>Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>30-day easy returns</span>
            </div>
            <Link
              href="/customer-reviews"
              className="flex items-center gap-3 text-sm text-asa-wine hover:underline pt-1"
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>See how customers style our pieces</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-serif font-bold">Customer Reviews</h2>
            <Link
              href="/customer-reviews"
              className="mt-1 inline-block text-sm text-asa-wine hover:underline"
            >
              Browse customer stories &rarr;
            </Link>
          </div>
          <ReviewForm
            productId={product.id}
            productName={product.name}
            onReviewCreated={(r) => setReviews((prev) => [r, ...prev])}
          />
        </div>
        <ReviewList reviews={reviews} />
      </div>

      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  )
}
