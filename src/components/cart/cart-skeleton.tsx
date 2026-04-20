import { Skeleton } from '@/components/ui/skeleton'

export function CartSkeleton() {
  return (
    <div className="container mx-auto px-4 pb-12 sm:pb-16">
      <Skeleton className="h-9 w-48 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg">
              <Skeleton className="w-24 h-24 rounded-md flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="border rounded-lg p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between pt-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
