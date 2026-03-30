"use client"

import { cn } from "@/lib/utils/index"

interface MarqueeProps {
  items: React.ReactNode[]
  className?: string
  trackClassName?: string
  speed?: number
  reverse?: boolean
  pauseOnHover?: boolean
}

export function Marquee({
  items,
  className,
  trackClassName,
  speed = 22,
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  const directionClass = reverse ? "animate-marquee-reverse" : "animate-marquee"

  return (
    <div className={cn("w-full overflow-hidden relative", className)}>
      <div
        className={cn(
          "flex whitespace-nowrap will-change-transform",
          directionClass,
          pauseOnHover ? "hover:animation-play-state-paused" : "",
          trackClassName
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
