import { cn } from "@/lib/utils"

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className }: GlitchTextProps) {
  return (
    <span 
      className={cn("glitch-heavy group relative inline-block transform-gpu", className)} 
      data-text={text}
    >
      {text}
      <span className="glitch-layer aria-hidden pointer-events-none" data-text={text}></span>
      <span className="glitch-layer-2 aria-hidden pointer-events-none" data-text={text}></span>
    </span>
  )
}
