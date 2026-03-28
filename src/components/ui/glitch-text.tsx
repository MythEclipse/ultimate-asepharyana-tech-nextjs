import { cn } from "@/lib/utils"

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className }: GlitchTextProps) {
  return (
    <span 
      className={cn("glitch-heavy group relative inline-block", className)} 
      data-text={text}
    >
      {text}
      <span className="glitch-layer" data-text={text}></span>
      <span className="glitch-layer-2" data-text={text}></span>
    </span>
  )
}
