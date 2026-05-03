"use client"

import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"


export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <nav
      role="navigation"
      aria-label="Primary"
      className="sticky top-0 z-100 w-full backdrop-blur-3xl bg-background/70 border-b border-border/50"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-4 md:px-8">
        {/* Logo Protocol */}
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
             <span className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block">Personal Portfolio</span>
          </div>
        </Link>

        {/* Cinematic Link Array */}
        <div className="hidden md:flex items-center space-x-2">
           <NavLink href="/project" label="Projects" currentPath={pathname} />

           <div className="w-8 h-px bg-border/50 mx-4" />

           {/* Theme Engine */}
<button
              onClick={cycleTheme}
              aria-label="Toggle theme mode"
              className="p-3.5 rounded-lg hover:bg-muted/50 transition-all group relative overflow-hidden active:scale-95"
              title={mounted ? `Theme: ${theme}` : "Theme: loading"}
            >
             <div className="relative z-10 w-5 h-5 flex items-center justify-center">
                {mounted ? (
                  theme === "light" ? (
                    <IconSun className="w-5 h-5 text-amber-500 transition-transform duration-700 group-hover:rotate-12" />
                  ) : theme === "dark" ? (
                    <IconMoon className="w-5 h-5 text-indigo-400 transition-transform duration-700 group-hover:-rotate-12" />
                  ) : (
                    <IconDeviceDesktop className="w-5 h-5 text-cyan-400 transition-transform duration-700 group-hover:scale-125 animate-pulse" />
                  )
                ) : (
                  <div className="w-5 h-5 rounded-full bg-border/20 animate-pulse" />
                )}
</div>
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <Link href="/dashboard" className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] rounded-lg glass border border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all active:scale-95 ml-3">
               Dashboard
            </Link>
        </div>

        {/* Mobile Navigation Trigger */}
        <button
          className="md:hidden p-3 rounded-lg hover:bg-muted/50 transition-all active:scale-95 group"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={isOpen}
        >
          <div className="space-y-1.5 w-6">
             <div className={`h-0.5 bg-foreground rounded-full transition-all duration-500 ${isOpen ? "rotate-45 translate-y-2" : "w-full"}`} />
             <div className={`h-0.5 bg-foreground rounded-full transition-all duration-500 ${isOpen ? "opacity-0" : "w-2/3"}`} />
             <div className={`h-0.5 bg-foreground rounded-full transition-all duration-500 ${isOpen ? "-rotate-45 -translate-y-2" : "w-full"}`} />
          </div>
        </button>
      </div>
      
      {/* Expanded Mobile Interface */}
      {isOpen && (
         <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-3xl animate-fade-in overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">
                <MobileNavLink 
                  href="/project" 
                  label="Projects" 
                  isActive={pathname === "/project" || pathname.startsWith("/project/")} 
                  onClick={() => setIsOpen(false)} 
                />
                
<div className="pt-8 mt-8 border-t border-border/20 flex items-center justify-between">
<button
                      onClick={cycleTheme}
                      className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4 py-2.5 rounded-lg glass border border-border/20 hover:border-border/40 transition-all"
                    > 
                      <span className="text-lg">
                        {theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "💻"}
                      </span>
                      {theme}
                    </button>

                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.25em] shadow-lg hover:scale-105 transition-transform active:scale-95">
                      Dashboard
                    </Link>
               </div>
            </div>
         </div>
      )}
    </nav>
  )
}

function NavLink({ href, label, currentPath }: { href: string; label: string; currentPath: string }) {
  const isActive = currentPath === href || (href !== "/" && currentPath.startsWith(href))
  
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-xl relative group/link ${
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
    >
      <span className="relative z-10">{label}</span>
      {isActive && (
        <>
          <div className="absolute inset-0 bg-primary/5 rounded-xl border border-primary/10 animate-fade-in" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full blur-[2px] animate-pulse" />
        </>
      )}
    </Link>
  )
}

function MobileNavLink({ href, label, isActive, onClick }: { href: string; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`block py-4 px-6 text-lg font-black italic uppercase tracking-tighter border rounded-xl transition-all duration-300 active:scale-95 ${
          isActive ? "bg-primary/10 border-primary/20 text-primary" : "border-white/5 hover:bg-white/5 hover:border-white/10 text-muted-foreground hover:text-foreground"
      }`}
    >
        {label}
    </Link>
  )
}
