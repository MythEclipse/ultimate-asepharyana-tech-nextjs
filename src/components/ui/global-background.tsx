"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"

export function GlobalBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    const container = containerRef.current
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const animations: Animation[] = []
    const style = getComputedStyle(document.documentElement)
    const paletteTokens = ["--primary", "--accent", "--gradient-start", "--gradient-mid", "--gradient-end"]
    const palette = paletteTokens
      .map((token) => style.getPropertyValue(token).trim())
      .filter(Boolean)
      .map((value) => `hsl(${value})`)
    const dotColors = palette.length
      ? palette
      : ["#38bdf8", "#a855f7", "#22d3ee", "#818cf8", "#c084fc"]
    const lineToken = style.getPropertyValue("--primary").trim()
    const lineColor = lineToken ? `hsl(${lineToken} / 0.2)` : "rgba(56, 189, 248, 0.2)"

    for (let i = 0; i < 80; i++) {
      const dot = document.createElement("div")
      dot.className = "absolute rounded-full"
      dot.style.width = `${Math.random() * 3 + 1}px`
      dot.style.height = dot.style.width
      dot.style.left = `${Math.random() * 100}%`
      dot.style.top = `${Math.random() * 100}%`
      dot.style.backgroundColor = dotColors[Math.floor(Math.random() * dotColors.length)]
      dot.style.opacity = `${Math.random() * 0.6 + 0.2}`
      container.appendChild(dot)

      if (!reduceMotion && dot.animate) {
        const driftX = (Math.random() - 0.5) * 60
        const driftY = (Math.random() - 0.5) * 60
        const scale = 1 + Math.random() * 0.25
        const duration = 7000 + Math.random() * 6000
        const delay = Math.random() * 2000
        const animation = dot.animate(
          [
            { transform: "translate(0, 0) scale(1)", opacity: dot.style.opacity },
            { transform: `translate(${driftX}px, ${driftY}px) scale(${scale})`, opacity: "0.85" },
            { transform: "translate(0, 0) scale(1)", opacity: dot.style.opacity },
          ],
          { duration, iterations: Infinity, easing: "ease-in-out", delay }
        )
        animations.push(animation)
      }
    }

    for (let i = 0; i < 40; i++) {
      const line = document.createElement("div")
      line.className = "absolute"
      line.style.width = `${Math.random() * 80 + 20}px`
      line.style.height = "1px"
      line.style.left = `${Math.random() * 100}%`
      line.style.top = `${Math.random() * 100}%`
      const rotation = Math.random() * 360
      line.style.transform = `rotate(${rotation}deg)`
      line.style.backgroundColor = lineColor
      container.appendChild(line)

      if (!reduceMotion && line.animate) {
        const duration = 9000 + Math.random() * 7000
        const delay = Math.random() * 3000
        const animation = line.animate(
          [
            { opacity: "0.1", transform: `rotate(${rotation}deg) translateX(0px)` },
            { opacity: "0.5", transform: `rotate(${rotation}deg) translateX(24px)` },
            { opacity: "0.1", transform: `rotate(${rotation}deg) translateX(0px)` },
          ],
          { duration, iterations: Infinity, easing: "ease-in-out", delay }
        )
        animations.push(animation)
      }
    }

    return () => {
      animations.forEach((animation) => animation.cancel())
      container.innerHTML = ""
    }
  }, [mounted, resolvedTheme])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none bg-background overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />
    </div>
  )
}