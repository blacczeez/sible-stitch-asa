import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const HERO = {
  src: '/images/tivaram-hero-1.webp',
  mobileSrc: '/images/tivaram-hero-1-mobile.webp',
  alt: 'African fashion model wearing vibrant Ankara print clothing',
} as const

export function HeroSection() {
  return (
    <section
      id="home-hero"
      className="relative h-[50vh] md:h-screen min-h-[400px] overflow-hidden bg-asa-charcoal"
    >
      {/*
        Native <picture> so the browser downloads only the matching asset
        (next/image priority on two fill images would preload both).
      */}
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet={HERO.mobileSrc}
          type="image/webp"
        />
        <img
          src={HERO.src}
          alt={HERO.alt}
          width={2560}
          height={1429}
          className="absolute inset-0 h-full w-full object-cover object-[0%_0%]"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

      <div className="relative z-20 h-full container mx-auto px-4 flex items-end pb-12 md:items-center md:pb-0">
        <div className="max-w-2xl">
          <p className="text-asa-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3 md:mb-5">
            New Collection 2026
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif font-semibold leading-[1.1] text-white mb-4 md:mb-6">
            Premium African{' '}
            <em className="italic font-light">Fashion</em>
          </h1>
          <p className="text-sm md:text-lg text-white/70 mb-6 md:mb-8 max-w-lg leading-relaxed">
            Discover our curated collection of Ankara prints, Adire, and
            made-to-order pieces for the modern global citizen.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-asa-gold text-asa-charcoal px-6 py-3 md:px-8 md:py-3.5 rounded-full font-semibold text-sm tracking-wide hover:bg-asa-gold/90 transition-colors cursor-pointer"
          >
            Shop Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="hidden lg:block absolute right-12 bottom-24">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white min-w-[200px]">
            <p className="text-3xl font-serif font-bold">500+</p>
            <p className="text-sm text-white/70 mt-1">Made to order</p>
            <div className="h-px bg-white/20 my-3" />
            <p className="text-3xl font-serif font-bold">30+</p>
            <p className="text-sm text-white/70 mt-1">Countries shipped</p>
          </div>
        </div>
      </div>
    </section>
  )
}
