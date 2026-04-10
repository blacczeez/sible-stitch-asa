import { HeroSection } from '@/components/home/hero-section'
import { CategoryShowcase } from '@/components/home/category-showcase'
import { ValueProps } from '@/components/home/value-props'
import { NewsletterSignup } from '@/components/home/newsletter-signup'
import { FeaturedProducts } from '@/components/home/featured-products'
import { getFeaturedProducts } from '@/lib/data/products'
import { listCategories } from '@/lib/data/categories'

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(8),
    listCategories(),
  ])

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featured} />
      <CategoryShowcase categories={categories} />
      <ValueProps />
      <NewsletterSignup />
    </>
  )
}
