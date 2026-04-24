import * as React from "react"
import { cn } from "@/lib/utils/index"

interface SectionProps {
  children?: React.ReactNode
  className?: string
  innerClassName?: string
  glow?: boolean
  glowVariant?: "primary" | "accent" | "both"
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      className,
      innerClassName,
      glow = false,
      glowVariant = "both",
    }: SectionProps,
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "py-16 sm:py-20 md:py-28 lg:py-40 px-4 sm:px-6 lg:px-8 relative overflow-visible",
          className
        )}
      >
        {glow && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {(glowVariant === "primary" || glowVariant === "both") && (
            <div className="absolute top-1/4 left-1/4 w-[150vw] md:w-200 h-[150vw] md:h-200 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow will-change-[transform,opacity]" />
          )}
          {(glowVariant === "accent" || glowVariant === "both") && (
            <div className="absolute bottom-1/4 right-1/4 w-[120vw] md:w-160 h-[120vw] md:h-160 bg-accent/10 rounded-full blur-[100px] animate-pulse-slow [animation-delay:2s] will-change-[transform,opacity]" />
          )}
        </div>
      )}
      <div className={cn("max-w-7xl mx-auto px-0 relative z-10", innerClassName)}>
        {children}
      </div>
    </section>
  )
})

Section.displayName = "Section"
