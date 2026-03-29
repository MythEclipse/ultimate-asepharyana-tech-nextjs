import { cn } from "@/lib/utils/index"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded bg-muted/30", className)} />
  )
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton className="aspect-[3/4.2] rounded-[2rem]" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonIndex() {
  return (
    <div className="space-y-32">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-12">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-3xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-2 w-24" />
            </div>
          </div>
          <SkeletonGrid count={6} />
        </div>
      ))}
    </div>
  )
}
