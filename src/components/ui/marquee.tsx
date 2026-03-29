"use client"

import { useRef, useEffect } from "react"
import { gsap } from "@/lib/gsap/gsap-init"
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
  const marqueeRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!trackRef.current) return

    const track = trackRef.current
    const tween = gsap.to(track, {
      x: reverse ? "50%" : "-50%",
      duration: speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: number) => x % (track.scrollWidth / 2)),
      },
    })

    const onEnter = () => pauseOnHover && tween.pause()
    const onLeave = () => pauseOnHover && tween.resume()

    const marqueeEl = marqueeRef.current
    marqueeEl?.addEventListener("mouseenter", onEnter)
    marqueeEl?.addEventListener("mouseleave", onLeave)

    return () => {
      tween.kill()
      marqueeEl?.removeEventListener("mouseenter", onEnter)
      marqueeEl?.removeEventListener("mouseleave", onLeave)
    }
  }, [speed, reverse, pauseOnHover])

  return (
    <div
      ref={marqueeRef}
      className={cn("w-full overflow-hidden relative", className)}
    >
      <div
        ref={trackRef}
        className={cn("flex whitespace-nowrap will-change-transform", trackClassName)}
      >
        {/* Duplicate items for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
