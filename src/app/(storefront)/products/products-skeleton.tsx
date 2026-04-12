import { Skeleton } from '@/components/ui/skeleton'

export function ProductsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-9 w-48 mb-2" />
      <Skeleton className="h-5 w-24 mb-6" />
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64">
          <Skeleton className="h-96 w-full rounded-lg" />
        </aside>
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[3/4] rounded-xl md:rounded-2xl mb-3" />
                <Skeleton className="h-3 w-1/3 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
