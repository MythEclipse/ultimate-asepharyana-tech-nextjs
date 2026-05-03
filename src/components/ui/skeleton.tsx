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
      <Skeleton className="aspect-[3/4.2] rounded-4xl" />
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

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonDetail({ className }: SkeletonProps) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-8", className)}>
      <Skeleton className="w-full md:w-80 aspect-[3/4] rounded-2xl" />
      <div className="flex-1 space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <SkeletonText lines={4} />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonEpisodeList({ count = 12, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-video rounded-lg" />
      ))}
    </div>
  )
}
