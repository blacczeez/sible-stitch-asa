import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { getProductBySlug, getRelatedProducts } from '@/lib/data/products'
import { listReviewsForProduct } from '@/lib/data/reviews'
import { ProductDetailContent } from './product-detail-content'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const getCachedProduct = unstable_cache(
    () => getProductBySlug(slug),
    ['product', slug],
    { revalidate: 60, tags: ['products'] }
  )

  const product = await getCachedProduct()
  if (!product) notFound()

  const getCachedReviews = unstable_cache(
    () => listReviewsForProduct(product.id),
    ['reviews', product.id],
    { revalidate: 60, tags: ['reviews', `reviews-${product.id}`] }
  )

  const getCachedRelated = unstable_cache(
    () => getRelatedProducts(product.categoryId, product.id, 4),
    ['related-products', product.categoryId, product.id],
    { revalidate: 120, tags: ['products'] }
  )

  const [initialReviews, relatedProducts] = await Promise.all([
    getCachedReviews(),
    getCachedRelated(),
  ])

  return (
    <ProductDetailContent
      product={product}
      initialReviews={initialReviews}
      relatedProducts={relatedProducts}
    />
  )
}
