
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { GlitchText } from "@/components/ui/glitch-text"
import { Heading } from "@/components/ui/heading"
import { cn } from "@/lib/utils/index"

interface PageHeroProps {
  badge: string
  title: string
  kicker?: string
  description?: React.ReactNode
  meta?: React.ReactNode
  className?: string
}

export function PageHero({
  badge,
  title,
  kicker,
  description,
  meta,
  className,
}: PageHeroProps) {
  return (
    <header className={cn("flex flex-col items-center text-center gap-8 mb-20", className)}>
      <Badge variant="glass">{badge}</Badge>
      <div className="space-y-2">
        <Heading as="h1" className="text-6xl md:text-8xl lg:text-[9rem]">
          <GlitchText
            text={title}
            className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          />
        </Heading>
        {kicker ? (
          <p className="text-2xl md:text-4xl font-black uppercase tracking-[0.22em] md:tracking-[0.3em] text-foreground/10">
            {kicker}
          </p>
        ) : null}
      </div>
      {description ? (
        <p className="max-w-2xl text-muted-foreground/70 text-base font-medium leading-relaxed">
          {description}
        </p>
      ) : null}
      {meta ? (
        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/50">
          {meta}
        </div>
      ) : null}
    </header>
  )
}