import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { Skeleton } from '@/components/ui/skeleton'
import { HeroSection } from '@/components/home/hero-section'
import { CategoryShowcase } from '@/components/home/category-showcase'
import { ValueProps } from '@/components/home/value-props'
import { NewsletterSignup } from '@/components/home/newsletter-signup'
import { FeaturedProducts } from '@/components/home/featured-products'
import { getFeaturedProducts } from '@/lib/data/products'
import { listCategories } from '@/lib/data/categories'

const getCachedFeatured = unstable_cache(
  () => getFeaturedProducts(8),
  ['featured-products'],
  { revalidate: 120, tags: ['products'] }
)

const getCachedCategories = unstable_cache(
  () => listCategories(),
  ['categories'],
  { revalidate: 120, tags: ['categories'] }
)

async function FeaturedSection() {
  const products = await getCachedFeatured()
  return <FeaturedProducts products={products} />
}

async function CategoriesSection() {
  const categories = await getCachedCategories()
  return <CategoryShowcase categories={categories} />
}

function FeaturedSkeleton() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="flex gap-4 md:gap-6 overflow-hidden pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[220px] sm:w-[260px]">
              <Skeleton className="aspect-[3/4] rounded-xl md:rounded-2xl mb-3" />
              <Skeleton className="h-3 w-1/3 mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoriesSkeleton() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="text-center mb-10">
        <Skeleton className="h-4 w-32 mx-auto mb-2" />
        <Skeleton className="h-10 w-48 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedSection />
      </Suspense>
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSection />
      </Suspense>
      <ValueProps />
      <NewsletterSignup />
    </>
  )
}
