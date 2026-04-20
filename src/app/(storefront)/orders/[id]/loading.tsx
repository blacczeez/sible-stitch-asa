import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function OrderLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-32 mt-1" />
        </CardHeader>
        <CardContent>
          {/* Timeline skeleton */}
          <div className="flex items-center justify-between mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {i > 0 && <Skeleton className="h-0.5 flex-1" />}
                  <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                  {i < 3 && <Skeleton className="h-0.5 flex-1" />}
                </div>
                <Skeleton className="h-3 w-16 mt-2" />
              </div>
            ))}
          </div>

          {/* Items skeleton */}
          <Skeleton className="h-5 w-12 mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>

          {/* Pricing skeleton */}
          <div className="space-y-2 mt-6">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between mt-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>

          {/* Address skeleton */}
          <div className="mt-6">
            <Skeleton className="h-5 w-32 mb-2" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
