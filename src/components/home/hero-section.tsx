import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative bg-asa-charcoal text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-asa-charcoal via-asa-charcoal/95 to-asa-charcoal/70" />
      <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <p className="text-asa-gold text-sm font-medium tracking-widest uppercase mb-4">
            Premium African Fashion
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
            Wear Your Heritage
            <br />
            <span className="text-asa-gold">With Pride</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-lg">
            Discover our curated collection of Ankara prints, casual wear, and
            handcrafted accessories for the modern global citizen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-asa-gold text-asa-charcoal hover:bg-asa-gold/90 font-semibold"
              asChild
            >
              <Link href="/products">Shop Collection</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/products?category=ankara">Explore Ankara</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
