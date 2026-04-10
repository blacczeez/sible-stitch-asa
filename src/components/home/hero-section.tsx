import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden bg-asa-charcoal">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1663044022557-7d5d4c1d5318?w=1920&q=80&fit=crop"
        alt="African fashion model wearing vibrant Ankara print clothing"
        fill
        className="object-cover object-top"
        priority
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-end pb-20 md:items-center md:pb-0">
        <div className="max-w-2xl">
          <p className="text-asa-gold text-xs font-semibold tracking-[0.25em] uppercase mb-5">
            New Collection 2026
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-semibold leading-[1.1] text-white mb-6">
            Premium African{' '}
            <em className="italic font-light">Fashion</em>
            <br />
            for the Modern Citizen
          </h1>
          <p className="text-base md:text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
            Discover our curated collection of Ankara prints, casual wear, and
            handcrafted accessories for the modern global citizen.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-asa-gold text-asa-charcoal px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide hover:bg-asa-gold/90 transition-colors cursor-pointer"
          >
            Shop Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Floating Glassmorphism Stat Card (desktop only) */}
        <div className="hidden lg:block absolute right-12 bottom-24">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white min-w-[200px]">
            <p className="text-3xl font-serif font-bold">500+</p>
            <p className="text-sm text-white/70 mt-1">Handcrafted pieces</p>
            <div className="h-px bg-white/20 my-3" />
            <p className="text-3xl font-serif font-bold">30+</p>
            <p className="text-sm text-white/70 mt-1">Countries shipped</p>
          </div>
        </div>
      </div>
    </section>
  )
}
