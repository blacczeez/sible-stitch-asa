'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const AUTO_ADVANCE_MS = 5000
const FADE_MS = 400
const PAUSE_AFTER_INTERACTION_MS = 12000

interface ImageGalleryProps {
  images: string[]
}

function useImageAspectRatio(src: string) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)

  useEffect(() => {
    const img = new window.Image()
    img.src = src
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight)
      }
    }
  }, [src])

  return aspectRatio
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const aspectRatio = useImageAspectRatio(images[selectedIndex] ?? '')

  const goTo = useCallback(
    (index: number) => {
      if (index === selectedIndex || images.length <= 1) return
      setPrevIndex(selectedIndex)
      setSelectedIndex(index)
    },
    [selectedIndex, images.length]
  )

  const goNext = useCallback(() => {
    if (images.length <= 1) return
    goTo((selectedIndex + 1) % images.length)
  }, [images.length, selectedIndex, goTo])

  const goPrev = useCallback(() => {
    if (images.length <= 1) return
    goTo((selectedIndex - 1 + images.length) % images.length)
  }, [images.length, selectedIndex, goTo])

  const pauseBriefly = useCallback(() => {
    setIsPaused(true)
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = setTimeout(() => setIsPaused(false), PAUSE_AFTER_INTERACTION_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (prevIndex === null) return
    const timer = setTimeout(() => setPrevIndex(null), FADE_MS)
    return () => clearTimeout(timer)
  }, [prevIndex])

  useEffect(() => {
    if (images.length <= 1 || isPaused) return
    const timer = setInterval(goNext, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [images.length, isPaused, goNext])

  function handleMainClick(e: React.MouseEvent<HTMLDivElement>) {
    if (images.length <= 1) return
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    if (clickX < rect.width * 0.3) {
      goPrev()
    } else {
      goNext()
    }
    pauseBriefly()
  }

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] rounded-2xl flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No images available</p>
      </div>
    )
  }

  const hasMultiple = images.length > 1

  return (
    <div className="space-y-4">
      <div
        className="relative mx-auto w-full max-w-full"
        style={{
          aspectRatio: aspectRatio ?? 3 / 4,
          maxHeight: 'min(75vh, 720px)',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={cn(
            'group relative h-full w-full overflow-hidden rounded-2xl',
            hasMultiple && 'cursor-pointer'
          )}
          onClick={handleMainClick}
          role={hasMultiple ? 'button' : undefined}
          aria-label={hasMultiple ? 'Click to view next image' : undefined}
        >
          {images.map((image, index) => {
            const isActive = index === selectedIndex
            const isPrev = index === prevIndex
            if (!isActive && !isPrev) return null

            return (
              <Image
                key={`${image}-${index}`}
                src={image}
                alt={`Product image ${index + 1}`}
                fill
                className={cn(
                  'object-contain object-center transition-opacity duration-300 ease-in-out',
                  isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
                )}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            )
          })}

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                  pauseBriefly()
                }}
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-asa-charcoal shadow-sm backdrop-blur-sm transition-opacity hover:bg-white opacity-70 md:opacity-0 md:group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                  pauseBriefly()
                }}
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-asa-charcoal shadow-sm backdrop-blur-sm transition-opacity hover:bg-white opacity-70 md:opacity-0 md:group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="size-5" />
              </button>

              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      goTo(index)
                      pauseBriefly()
                    }}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      index === selectedIndex
                        ? 'w-5 bg-asa-gold'
                        : 'w-1.5 bg-asa-charcoal/25 hover:bg-asa-charcoal/40'
                    )}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                goTo(index)
                pauseBriefly()
              }}
              className={cn(
                'relative size-16 md:size-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                selectedIndex === index
                  ? 'border-asa-gold ring-1 ring-asa-gold/30'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={selectedIndex === index}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-contain object-center p-1"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
