"use client"

import Link from "next/link"
import { useState } from "react"

import { DesktopNav } from "./navbar/desktop-nav"
import { MobileNav } from "./navbar/mobile-nav"
import { ThemeToggle } from "./navbar/theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav
      role="navigation"
      aria-label="Primary"
      className="sticky top-0 z-100 w-full backdrop-blur-3xl bg-background/70 border-b border-border/50"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-6 group">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
            <div className="w-11 h-11 rounded-lg bg-foreground flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300 relative z-10">
              <span className="text-background font-black text-xl italic tracking-tighter">A</span>
            </div>
          </div>
          <div className="hidden sm:block space-y-0.5">
            <span className="text-xl font-black italic tracking-tighter uppercase leading-none block group-hover:text-primary transition-colors">
              Asep <span className="text-primary group-hover:text-foreground transition-colors">Haryana</span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block">
              Personal Portfolio
            </span>
          </div>
        </Link>

        <DesktopNav themeToggle={<ThemeToggle mode="icon" />} />

        <button
          className="md:hidden p-3 rounded-lg hover:bg-muted/50 transition-all active:scale-95 group"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5 w-6">
            <div
              className={`h-0.5 bg-foreground rounded-full transition-all duration-500 ${isOpen ? "rotate-45 translate-y-2" : "w-full"}`}
            />
            <div
              className={`h-0.5 bg-foreground rounded-full transition-all duration-500 ${isOpen ? "opacity-0" : "w-2/3"}`}
            />
            <div
              className={`h-0.5 bg-foreground rounded-full transition-all duration-500 ${isOpen ? "-rotate-45 -translate-y-2" : "w-full"}`}
            />
          </div>
        </button>
      </div>

      {isOpen && <MobileNav themeToggle={<ThemeToggle mode="label" />} onClose={() => setIsOpen(false)} />}
    </nav>
  )
}