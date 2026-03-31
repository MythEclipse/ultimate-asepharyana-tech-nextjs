"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { ThemeProvider } from "next-themes"

const WebGLBackground = dynamic(
  () => import("@/components/three/webgl-background").then((m) => ({ default: m.WebGLBackground })),
  { ssr: false }
)

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
        <WebGLBackground />

        <div className="fixed inset-0 pointer-events-none -z-10 select-none overflow-visible">
          <div className="absolute bottom-[-20%] right-[-10%] w-[1200px] h-[1200px] bg-accent/10 rounded-full blur-[150px] opacity-30 animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,hsla(var(--primary),0.03)_0%,transparent_70%)]" />
        </div>

        <Navbar />

        <main key={pathname} className="relative z-10 flex-1 flex flex-col max-w-[100vw] transition-all duration-300">
          {children}
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  )
}
