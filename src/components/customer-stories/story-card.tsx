import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CustomerStory } from '@/types'

interface StoryCardProps {
  story: CustomerStory
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white/70 ring-1 ring-white/80 shadow-[0_8px_40px_-12px_rgba(26,23,20,0.1)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-asa-cream">
        {story.mediaType === 'video' ? (
          <video
            src={story.mediaUrl}
            className="h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <Image
            src={story.mediaUrl}
            alt={`${story.customerName} wearing ${story.productName}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-asa-gold mb-1">
          {story.customerName}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-1">
          {story.description}
        </p>
        <div className="mt-5 pt-4 border-t border-border/60">
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
            {story.productName}
          </p>
          <Button
            asChild
            className="w-full bg-asa-charcoal text-white hover:bg-asa-charcoal/90"
          >
            <Link href={`/products/${story.productSlug}`}>
              Shop this piece
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
