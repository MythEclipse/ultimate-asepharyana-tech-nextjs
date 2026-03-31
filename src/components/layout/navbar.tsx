"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useAuth } from "@/lib/store/auth"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
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
      className="sticky top-0 z-[100] w-full backdrop-blur-3xl bg-background/70 border-b border-border/50"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo Protocol */}
        <Link href="/" className="flex items-center space-x-6 group">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
            <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 relative z-10">
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
             className="p-4 rounded-2xl hover:bg-muted/50 transition-all group relative overflow-hidden active:scale-95"
             title={mounted ? `Theme: ${theme}` : "Theme: loading"}
           >
             <div className="relative z-10 w-5 h-5 flex items-center justify-center">
                {mounted ? (
                  theme === "dark" || theme === "system" ? ( // Wait next-themes resolving is complex, simplified logic
                     <svg className="w-5 h-5 text-indigo-400 group-hover:-rotate-12 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                     </svg>
                  ) : (
                     <svg className="w-5 h-5 text-amber-500 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                     </svg>
                  )
                ) : (
                  <div className="w-5 h-5 rounded-full bg-border/20 animate-pulse" />
                )}
             </div>
             <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           </button>
           
           {/* Security Handshake */}
           {user ? (
             <div className="flex items-center gap-4 ml-4">
                <Link href="/dashboard" className="px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl glass border border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all active:scale-95">
                   Dashboard
                </Link>
             </div>
           ) : (
             <Link href="/login" className="ml-4 px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl bg-foreground text-background hover:scale-105 active:scale-95 transition-all shadow-2xl relative group overflow-hidden border border-border/20">
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity" />
             </Link>
           )}
        </div>

        {/* Mobile Navigation Trigger */}
        <button
          className="md:hidden p-4 rounded-2xl hover:bg-muted/50 transition-all active:scale-95 group"
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
            <div className="container mx-auto px-8 py-10 space-y-4">
                <MobileNavLink 
                  href="/project" 
                  label="Projects" 
                  isActive={pathname === "/project" || pathname.startsWith("/project/")} 
                  onClick={() => setIsOpen(false)} 
                />
                
                <div className="pt-8 mt-8 border-t border-border/20 flex items-center justify-between">
                   <button
                     onClick={cycleTheme}
                     className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground px-6 py-4 rounded-2xl glass border border-border/20 hover:border-border/40 transition-all"
                   > 
                     <span className="text-lg">
                       {theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "💻"}
                     </span>
                     {theme}
                   </button>
                   
                   <Link href="/login" onClick={() => setIsOpen(false)} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-transform active:scale-95">
                     Login
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
      className={`block py-5 px-8 text-lg font-black italic uppercase tracking-tighter border rounded-3xl transition-all duration-500 active:scale-95 ${
          isActive ? "bg-primary/10 border-primary/20 text-primary" : "border-white/5 hover:bg-white/5 hover:border-white/10 text-muted-foreground hover:text-foreground"
      }`}
    >
        {label}
    </Link>
  )
}
