'use client'

import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-asa-charcoal mb-4">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <Button onClick={reset} className="bg-asa-charcoal">
          Try Again
        </Button>
      </div>
    </div>
  )
}
