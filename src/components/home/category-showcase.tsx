'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Category } from '@/types'

interface CategoryShowcaseProps {
  categories: Category[]
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const hasDesktopOverflow = categories.length > 3
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const dragStateRef = useRef<{
    isDragging: boolean
    startX: number
    startScrollLeft: number
  }>({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
  })

  const updateScrollState = useCallback(() => {
    const node = scrollerRef.current
    if (!node) return
    const maxScrollLeft = node.scrollWidth - node.clientWidth
    setCanScrollLeft(node.scrollLeft > 4)
    setCanScrollRight(node.scrollLeft < maxScrollLeft - 4)
  }, [])

  useEffect(() => {
    if (!hasDesktopOverflow) return
    updateScrollState()
    window.addEventListener('resize', updateScrollState)
    return () => {
      window.removeEventListener('resize', updateScrollState)
    }
  }, [hasDesktopOverflow, updateScrollState])

  function scrollByCards(direction: 1 | -1) {
    const node = scrollerRef.current
    if (!node) return
    const cardWidth = node.clientWidth / 3
    node.scrollBy({
      left: direction * cardWidth,
      behavior: 'smooth',
    })
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    const node = scrollerRef.current
    if (!node) return
    dragStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startScrollLeft: node.scrollLeft,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const node = scrollerRef.current
    if (!node || !dragStateRef.current.isDragging) return
    const delta = e.clientX - dragStateRef.current.startX
    node.scrollLeft = dragStateRef.current.startScrollLeft - delta
  }

  function handlePointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    dragStateRef.current.isDragging = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const card = (category: Category) => (
    <Link
      key={category.id}
      href={`/products?category=${category.slug}`}
      className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
    >
      <Image
        src={category.image || 'https://picsum.photos/seed/cat/800/1000'}
        alt={category.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/5" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-serif font-semibold text-white mb-1">
          {category.name}
        </h3>
        <p className="text-sm text-white/70">{category.description}</p>
        <span className="inline-flex items-center gap-1 mt-4 px-5 py-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          Shop Now
        </span>
      </div>
    </Link>
  )

  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-asa-gold mb-2">
          Browse Collections
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-asa-charcoal">
          Shop by Category
        </h2>
      </div>
      {!hasDesktopOverflow ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(card)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:hidden">
            {categories.map(card)}
          </div>

          <div className="relative hidden lg:block">
            <div
              ref={scrollerRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onScroll={updateScrollState}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="basis-[calc((100%-3rem)/3)] min-w-0 shrink-0 snap-start"
                >
                  {card(category)}
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              <button
                type="button"
                aria-label="Scroll categories left"
                onClick={() => scrollByCards(-1)}
                disabled={!canScrollLeft}
                className="pointer-events-auto ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-asa-charcoal shadow-md transition disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                aria-label="Scroll categories right"
                onClick={() => scrollByCards(1)}
                disabled={!canScrollRight}
                className="pointer-events-auto mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-asa-charcoal shadow-md transition disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
