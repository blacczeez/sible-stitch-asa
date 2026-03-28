'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] rounded-lg bg-asa-cream flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No images available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-asa-cream">
        <Image
          src={images[selectedIndex]}
          alt={`Product image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative size-16 md:size-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors',
                selectedIndex === index
                  ? 'border-asa-gold'
                  : 'border-transparent hover:border-asa-gold/50'
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
