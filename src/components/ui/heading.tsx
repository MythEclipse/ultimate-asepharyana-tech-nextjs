import { cn } from "@/lib/utils/index"

import { GlitchText } from "./glitch-text"

interface HeadingProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  glitch?: boolean
  glitchText?: string
}

export function Heading({
  children,
  className,
  as: Tag = "h2",
  glitch = false,
  glitchText,
}: HeadingProps) {
  const baseClasses = "font-black italic tracking-tighter uppercase leading-none font-display transition-all duration-700"
  const tagClasses = {
    h1: "text-6xl sm:text-7xl md:text-8xl lg:text-9xl",
    h2: "text-6xl md:text-8xl",
    h3: "text-2xl md:text-3xl",
    h4: "text-xl md:text-2xl",
    h5: "text-lg md:text-xl",
    h6: "text-base md:text-lg",
  }

  return (
    <Tag className={cn(baseClasses, tagClasses[Tag], className)}>
      {glitch && glitchText ? (
        <>
          {children} <GlitchText text={glitchText} className="text-primary" />
        </>
      ) : (
        children
      )}
    </Tag>
  )
}
