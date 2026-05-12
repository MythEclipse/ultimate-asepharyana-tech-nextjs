"use client"

import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

import { THEME_SEQUENCE } from "./nav-data"

interface ThemeToggleProps {
  mode?: "icon" | "label"
}

export function ThemeToggle({ mode = "icon" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    const nextIndex = (THEME_SEQUENCE.indexOf((theme as (typeof THEME_SEQUENCE)[number]) || "system") + 1) % THEME_SEQUENCE.length
    setTheme(THEME_SEQUENCE[nextIndex])
  }

  if (!mounted) {
    if (mode === "icon") {
      return <div className="w-5 h-5 rounded-full bg-border/20 animate-pulse" />
    }
    return <div className="h-8 w-24 bg-border/20 animate-pulse rounded-lg" />
  }

  if (mode === "label") {
    return (
      <button
        onClick={cycleTheme}
        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4 py-2.5 rounded-lg border border-border/20 hover:border-border/40 transition-all"
      >
        <span className="text-lg">
          {theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "💻"}
        </span>
        {theme}
      </button>
    )
  }

  return (
    <button
      onClick={cycleTheme}
      aria-label="Toggle theme mode"
      className="p-3.5 rounded-lg hover:bg-muted/50 transition-all group relative overflow-hidden active:scale-95"
      title={`Theme: ${theme}`}
    >
      <div className="relative z-10 w-5 h-5 flex items-center justify-center">
        {theme === "light" ? (
          <IconSun className="w-5 h-5 text-amber-500 transition-transform duration-700 group-hover:rotate-12" />
        ) : theme === "dark" ? (
          <IconMoon className="w-5 h-5 text-indigo-400 transition-transform duration-700 group-hover:-rotate-12" />
        ) : (
          <IconDeviceDesktop className="w-5 h-5 text-cyan-400 transition-transform duration-700 group-hover:scale-125 animate-pulse" />
        )}
      </div>
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}
