"use client"


import { Section } from "@/components/ui/section"
import { SparklesCore } from "@/components/ui/sparkles"
import { Badge } from "@/components/ui/badge"
import { IconBook } from "@tabler/icons-react"
import { KomikHubContent } from "@/components/komik/komik-hub-content"
import { komikSearchRoute } from "@/lib/utils/routes"

export default function KomikPage() {
  const searchRoute = komikSearchRoute()

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-orange-500/30 transition-colors duration-500">
      <Section className="relative overflow-hidden py-28 md:py-32">
        <div className="absolute inset-0 pointer-events-none z-0">
          <SparklesCore
            id="particles-komik"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#f97316"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <Badge variant="outline" className="mb-4 text-orange-500 border-orange-500/50 bg-orange-500/5 px-4 py-1">
            Komik Library
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-foreground">
            KOMIK<span className="text-orange-500">INDEX</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
            Browse manga, manhwa, and manhua chapters.
          </p>

          <div className="mt-10 max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000" />
            <form action={searchRoute} className="relative flex items-center bg-card border border-border rounded-2xl p-1 transition-colors duration-500">
              <div className="pl-4 text-muted-foreground">
                <IconBook size={20} className="text-orange-500/50" />
              </div>
              <input
                type="text"
                name="q"
                placeholder="Search manga, manhwa, or manhua..."
                className="w-full bg-transparent border-none outline-none px-4 py-4 text-foreground placeholder:text-muted-foreground/50 font-bold"
              />
              <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all mr-1">
                Search
              </button>
            </form>
          </div>
        </div>
      </Section>

      <Section className="py-20">
        <KomikHubContent />
      </Section>
    </main>
  )
}
