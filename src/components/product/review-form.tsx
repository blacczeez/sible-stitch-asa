'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { toast } from 'sonner'

interface ReviewFormProps {
  productId: string
  productName: string
  onSubmit?: (data: {
    rating: number
    title: string
    body: string
  }) => Promise<void>
  onReviewCreated?: (review: import('@/types').Review) => void
}

export function ReviewForm({
  productId,
  productName,
  onSubmit,
  onReviewCreated,
}: ReviewFormProps) {
  const TITLE_MAX_LENGTH = 200
  const BODY_MAX_LENGTH = 2000

  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function resetForm() {
    setRating(0)
    setHoveredRating(0)
    setTitle('')
    setBody('')
    setErrors({})
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    const normalizedTitle = title.trim()
    const normalizedBody = body.trim()
    const nextErrors: { title?: string; body?: string } = {}

    if (normalizedTitle.length === 0) {
      nextErrors.title = 'Review title is required'
    } else if (normalizedTitle.length > TITLE_MAX_LENGTH) {
      nextErrors.title = `Review title must be ${TITLE_MAX_LENGTH} characters or fewer`
    }

    if (normalizedBody.length === 0) {
      nextErrors.body = 'Review body is required'
    } else if (normalizedBody.length > BODY_MAX_LENGTH) {
      nextErrors.body = `Review body must be ${BODY_MAX_LENGTH} characters or fewer`
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit({ rating, title: normalizedTitle, body: normalizedBody })
      } else {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            rating,
            title: normalizedTitle,
            body: normalizedBody,
          }),
        })

        if (!res.ok) {
          const responseBody = await res.json().catch(() => null)
          const fieldErrors = responseBody?.details?.fieldErrors as
            | Record<string, string[]>
            | undefined
          const firstFieldError = fieldErrors
            ? Object.values(fieldErrors).flat()[0]
            : undefined
          throw new Error(firstFieldError || responseBody?.error || 'Failed to submit review')
        }

        const data = await res.json()
        if (data.review && onReviewCreated) {
          onReviewCreated(data.review)
        }
      }

      toast.success('Review submitted successfully!')
      resetForm()
      setOpen(false)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to submit review. Please try again.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          resetForm()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Write a Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your thoughts about {productName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating Selector */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="p-0.5 transition-transform hover:scale-110"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={cn(
                      'size-6 transition-colors',
                      star <= displayRating
                        ? 'fill-asa-gold text-asa-gold'
                        : 'text-gray-300'
                    )}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} of 5
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="review-title">Title</Label>
            <Input
              id="review-title"
              placeholder="Summarize your experience"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }))
                }
              }}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p className="text-xs text-destructive mt-1">{errors.title}</p>
            )}
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="review-body">Review</Label>
            <Textarea
              id="review-body"
              placeholder="Tell us more about your experience with this product..."
              value={body}
              onChange={(e) => {
                setBody(e.target.value)
                if (errors.body) {
                  setErrors((prev) => ({ ...prev, body: undefined }))
                }
              }}
              rows={4}
              aria-invalid={Boolean(errors.body)}
            />
            {errors.body && (
              <p className="text-xs text-destructive mt-1">{errors.body}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="bg-asa-charcoal text-white hover:bg-asa-charcoal/90"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Submitting...
                </span>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
