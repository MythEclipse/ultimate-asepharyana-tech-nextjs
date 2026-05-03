"use client"

import { usePathname } from "next/navigation"
import { ThemeProvider } from "next-themes"

import { useLoadingOverlayState } from "@/components/providers/loading-provider"
import { GlobalBackground } from "@/components/ui/global-background"
import { PageLoadingOverlay } from "@/components/ui/page-loading-overlay"
import { useIsMounted } from "@/lib/hooks/use-mounted"

import { Footer } from "./footer"
import { Navbar } from "./navbar"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const mounted = useIsMounted()
  const { show, label } = useLoadingOverlayState()

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <GlobalBackground />
      <div className="min-h-screen flex flex-col text-foreground selection:bg-primary/30 selection:text-foreground relative z-10">
        <Navbar />

        <main key={mounted ? pathname : ""} className="relative flex-1 flex flex-col w-full">
          {children}
        </main>

        <Footer />

        <PageLoadingOverlay show={show} label={label ?? "LOADING"} />
      </div>
    </ThemeProvider>
  )
}
