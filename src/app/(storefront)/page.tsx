import { HeroSection } from '@/components/home/hero-section'
import { CategoryShowcase } from '@/components/home/category-showcase'
import { ValueProps } from '@/components/home/value-props'
import { NewsletterSignup } from '@/components/home/newsletter-signup'
import { FeaturedProducts } from '@/components/home/featured-products'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <ValueProps />
      <NewsletterSignup />
    </>
  )
}
