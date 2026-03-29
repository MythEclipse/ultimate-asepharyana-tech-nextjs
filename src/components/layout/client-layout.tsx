"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { ThemeProvider } from "next-themes"

// Three.js WebGL background — client-only, no SSR
const WebGLBackground = dynamic(
  () => import("@/components/three/webgl-background").then((m) => ({ default: m.WebGLBackground })),
  { ssr: false }
)

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
        {/* Three.js WebGL particle background — lowest layer */}
        <WebGLBackground />

        {/* Premium Cinematic Background Layer */}
        <div className="fixed inset-0 pointer-events-none -z-10 select-none overflow-hidden">
          {/* Atmospheric Orbs */}
          <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[120px] opacity-40 animate-pulse-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[1200px] h-[1200px] bg-accent/10 rounded-full blur-[150px] opacity-30 animate-pulse-slow" />
          
          {/* Central Ambient Depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,hsla(var(--primary),0.03)_0%,transparent_70%)]" />
        </div>

        <Navbar />

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
            transition={{ 
              duration: 0.4, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="relative z-10 flex-1 flex flex-col max-w-[100vw]"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        <Footer />
      </div>
    </ThemeProvider>
  )
}
