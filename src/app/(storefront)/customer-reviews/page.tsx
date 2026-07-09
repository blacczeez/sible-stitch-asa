import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { listPublishedCustomerStories } from '@/lib/data/customer-stories'
import { StoryCard } from '@/components/customer-stories/story-card'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Customer Reviews',
  description:
    `Real stories from ${BRAND.name} customers celebrating African-inspired fabrics and made-to-order fashion.`,
}

const getStories = unstable_cache(
  () => listPublishedCustomerStories(),
  ['customer-stories-page'],
  { tags: ['customer-stories'], revalidate: 60 }
)

export default async function CustomerReviewsPage() {
  const stories = await getStories()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-serif font-bold text-asa-charcoal mb-2">
          Customer Stories
        </h1>
        <p className="text-muted-foreground">
          Hear from our community about the fabrics, the fit, and the feeling of
          wearing {BRAND.name}. Every piece is made to order — find your
          inspiration and shop the look.
        </p>
      </div>

      {stories.length === 0 ? (
        <div className="rounded-2xl bg-muted/40 py-16 text-center">
          <p className="text-muted-foreground">
            Customer stories are coming soon. Check back shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  )
}
