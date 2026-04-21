'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

type HeroSlide =
  | { type: 'image'; src: string; mobileSrc: string; alt: string }
  | { type: 'video'; src: string; poster?: string }

const HERO_SLIDES: HeroSlide[] = [
  {
    type: 'image',
    src: '/images/sible-hero-1.webp',
    mobileSrc: '/images/sible-hero-1-mobile.webp',
    alt: 'African fashion model wearing vibrant Ankara print clothing',
  },
  {
    type: 'image',
    src: '/images/sible-hero-2.webp',
    mobileSrc: '/images/sible-hero-2-mobile.webp',
    alt: 'African fashion model wearing vibrant Ankara print clothing',
  },
  // Add a video slide:
  // {
  //   type: 'video',
  //   src: '/videos/sible-hero.mp4',
  //   poster: '/images/sible-hero-1.webp',
  // },
]

const TRANSITION_DURATION = 6000
const FADE_DURATION = 500

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)

  const advance = useCallback(() => {
    if (HERO_SLIDES.length <= 1) return
    setPrevIndex(activeIndex)
    setActiveIndex((i) => (i + 1) % HERO_SLIDES.length)
  }, [activeIndex])

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return
    const timer = setInterval(advance, TRANSITION_DURATION)
    return () => clearInterval(timer)
  }, [advance])

  useEffect(() => {
    if (prevIndex === null) return
    const timer = setTimeout(() => setPrevIndex(null), FADE_DURATION)
    return () => clearTimeout(timer)
  }, [prevIndex])

  return (
    <section className="relative h-[50vh] md:h-screen min-h-[400px] overflow-hidden ">
      {/* Stacked slides with crossfade */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === activeIndex
        const isPrev = index === prevIndex

        return (
          <div
            key={slide.type === 'video' ? slide.src : slide.src}
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: isActive || isPrev ? 1 : 0,
              transitionDuration: `${FADE_DURATION}ms`,
              transitionTimingFunction: 'ease-in-out',
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
            }}
          >
            {slide.type === 'video' ? (
              <video
                src={slide.src}
                poster={slide.poster}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            ) : (
              <>
                {/* Mobile: portrait crop */}
                <Image
                  src={slide.mobileSrc}
                  alt={slide.alt}
                  fill
                  className="object-cover md:hidden"
                  style={{ objectPosition: '0% 0%' }}
                  priority={index === 0}
                  sizes="100vw"
                />
                {/* Desktop: full landscape */}
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="hidden md:block object-cover"
                  style={{ objectPosition: '0% 0%' }}
                  priority={index === 0}
                  sizes="100vw"
                />
              </>
            )}
          </div>
        )
      })}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-asa-charcoal via-black/30 to-transparent" />

      {/* Content */}
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
            Discover our curated collection of Ankara prints, casual wear, and
            handcrafted accessories for the modern global citizen.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-asa-gold text-asa-charcoal px-6 py-3 md:px-8 md:py-3.5 rounded-full font-semibold text-sm tracking-wide hover:bg-asa-gold/90 transition-colors cursor-pointer"
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

      {/* Slide indicators */}
      {HERO_SLIDES.length > 1 && (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setPrevIndex(activeIndex)
                setActiveIndex(i)
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? 'w-8 bg-asa-gold'
                  : 'w-4 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
