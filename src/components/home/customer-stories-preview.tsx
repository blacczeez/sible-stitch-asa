import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { CustomerStory } from '@/types'
import { StoryCard } from '@/components/customer-stories/story-card'

interface CustomerStoriesPreviewProps {
  stories: CustomerStory[]
}

export function CustomerStoriesPreview({ stories }: CustomerStoriesPreviewProps) {
  if (stories.length === 0) return null

  const preview = stories.slice(0, 3)

  return (
    <section className="py-16 md:py-20 bg-asa-cream/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-asa-gold mb-2">
              Real Customers
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-asa-charcoal">
              Customer Stories
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              See how our community celebrates African-inspired fabrics — and shop
              the looks they love.
            </p>
          </div>
          <Link
            href="/customer-reviews"
            className="inline-flex items-center gap-2 text-sm font-medium text-asa-wine hover:underline shrink-0"
          >
            See all stories
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {preview.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  )
}
