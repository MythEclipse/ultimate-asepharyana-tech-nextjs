
import * as React from "react"

import { Section } from "@/components/ui/section"
import { cn } from "@/lib/utils/index"

interface PageShellProps {
  children: React.ReactNode
  className?: string
  contentClassName?: string
  glow?: boolean
}

export function PageShell({
  children,
  className,
  contentClassName,
  glow = true,
}: PageShellProps) {
  return (
    <main
      className={cn(
        "min-h-screen text-foreground relative overflow-hidden",
        className
      )}
    >
      <Section
        glow={glow}
        glowVariant="both"
        className={cn("max-w-6xl mx-auto pb-32", contentClassName)}
      >
        {children}
      </Section>
    </main>
  )
}