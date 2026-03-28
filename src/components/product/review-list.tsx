import { RatingStars } from '@/components/ui/rating-stars'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { BadgeCheck } from 'lucide-react'
import type { Review } from '@/types'

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    )
  }

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const totalReviews = reviews.length

  // Distribution of ratings
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl font-bold text-asa-charcoal">
            {averageRating.toFixed(1)}
          </span>
          <RatingStars rating={averageRating} size={18} />
          <span className="text-sm text-muted-foreground">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        <div className="flex-1 space-y-1.5">
          {distribution.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-right text-muted-foreground">
                {star}
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-asa-gold rounded-full transition-all"
                  style={{
                    width:
                      totalReviews > 0
                        ? `${(count / totalReviews) * 100}%`
                        : '0%',
                  }}
                />
              </div>
              <span className="w-6 text-right text-xs text-muted-foreground">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Review Cards */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RatingStars rating={review.rating} size={14} />
                {review.isVerified && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <BadgeCheck className="size-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(review.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-asa-charcoal">
                {review.userName}
              </span>
            </div>

            {review.title && (
              <h4 className="text-sm font-semibold text-asa-charcoal">
                {review.title}
              </h4>
            )}

            {review.body && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.body}
              </p>
            )}

            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </div>
  )
}
