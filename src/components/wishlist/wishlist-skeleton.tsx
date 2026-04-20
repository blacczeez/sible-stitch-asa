import { Skeleton } from '@/components/ui/skeleton'

export function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[3/4] rounded-xl md:rounded-2xl mb-3" />
          <Skeleton className="h-3 w-1/3 mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  )
}
