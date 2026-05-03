"use client"

import { useEffect, useRef, useState } from "react"

export function GlobalBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    const container = containerRef.current
    
    for (let i = 0; i < 80; i++) {
      const dot = document.createElement("div")
      dot.className = "absolute rounded-full animate-pulse"
      dot.style.width = `${Math.random() * 3 + 1}px`
      dot.style.height = dot.style.width
      dot.style.left = `${Math.random() * 100}%`
      dot.style.top = `${Math.random() * 100}%`
      dot.style.backgroundColor = ["#38bdf8", "#a855f7", "#22d3ee", "#818cf8", "#c084fc"][Math.floor(Math.random() * 5)]
      dot.style.opacity = `${Math.random() * 0.6 + 0.2}`
      dot.style.animationDelay = `${Math.random() * 3}s`
      dot.style.animationDuration = `${Math.random() * 2 + 2}s`
      container.appendChild(dot)
    }

    for (let i = 0; i < 40; i++) {
      const line = document.createElement("div")
      line.className = "absolute bg-cyan-500/20"
      line.style.width = `${Math.random() * 80 + 20}px`
      line.style.height = "1px"
      line.style.left = `${Math.random() * 100}%`
      line.style.top = `${Math.random() * 100}%`
      line.style.transform = `rotate(${Math.random() * 360}deg)`
      container.appendChild(line)
    }

    return () => {
      container.innerHTML = ""
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none bg-slate-950 overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[200px]" />
    </div>
  )
}