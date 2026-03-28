import { Star, StarHalf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: number
  className?: string
  showValue?: boolean
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 16,
  className,
  showValue = false,
}: RatingStarsProps) {
  const stars = []

  for (let i = 1; i <= maxRating; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <Star
          key={i}
          className="fill-asa-gold text-asa-gold"
          size={size}
        />
      )
    } else if (i - 0.5 <= rating) {
      stars.push(
        <StarHalf
          key={i}
          className="fill-asa-gold text-asa-gold"
          size={size}
        />
      )
    } else {
      stars.push(
        <Star key={i} className="text-gray-300" size={size} />
      )
    }
  }

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {stars}
      {showValue && (
        <span className="ml-1 text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
