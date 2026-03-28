"use client"

import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { ThemeProvider } from "next-themes"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-background text-foreground transition-colors duration-700">
        {/* Premium Cinematic Infrastructure (Global Background) */}
        <div className="fixed inset-0 pointer-events-none -z-50 select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
          
          {/* Pulsing Stellar Orbs */}
          <div className="absolute top-[-10%] left-[-5%] w-[60rem] h-[60rem] bg-primary/10 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[70rem] h-[70rem] bg-accent/10 rounded-full blur-[150px] opacity-40" />
          
          {/* Central Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-[180px] opacity-20" />
          
          {/* Static Noise layer for texture depth */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.svg')]" />
        </div>

        {/* <NavigationProgress /> - Replaced by Next.js navigation paradigms */}
        <Navbar />
        
        <main className="relative z-10 flex-1 flex flex-col max-w-[100vw]">
          {children}
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  )
}
