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
          "py-24 md:py-40 lg:py-56 px-6 relative overflow-visible",
          className
        )}
      >
        {glow && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {(glowVariant === "primary" || glowVariant === "both") && (
            <div className="absolute top-1/4 left-1/4 w-[150vw] md:w-[50rem] h-[150vw] md:h-[50rem] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow max-w-[50rem] max-h-[50rem] will-change-[transform,opacity]" />
          )}
          {(glowVariant === "accent" || glowVariant === "both") && (
            <div className="absolute bottom-1/4 right-1/4 w-[120vw] md:w-[40rem] h-[120vw] md:h-[40rem] bg-accent/10 rounded-full blur-[100px] animate-pulse-slow [animation-delay:2s] max-w-[40rem] max-h-[40rem] will-change-[transform,opacity]" />
          )}
        </div>
      )}
      <div className={cn("max-w-7xl mx-auto relative z-10", innerClassName)}>
        {children}
      </div>
    </section>
  )
})

Section.displayName = "Section"
