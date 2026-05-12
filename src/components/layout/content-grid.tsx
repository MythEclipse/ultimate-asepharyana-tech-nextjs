import { cn } from "@/lib/utils/index"

interface ContentGridProps {
  children: React.ReactNode
  className?: string
  variant?: "cards" | "media"
}

export function ContentGrid({
  children,
  className,
  variant = "cards",
}: ContentGridProps) {
  return (
    <div
      className={cn(
        variant === "media"
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 gap-y-10"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {children}
    </div>
  )
}