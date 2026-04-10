import { notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '@/lib/data/products'
import { listReviewsForProduct } from '@/lib/data/reviews'
import { ProductDetailContent } from './product-detail-content'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [initialReviews, relatedProducts] = await Promise.all([
    listReviewsForProduct(product.id),
    getRelatedProducts(product.categoryId, product.id, 4),
  ])

  return (
    <ProductDetailContent
      product={product}
      initialReviews={initialReviews}
      relatedProducts={relatedProducts}
    />
  )
}
