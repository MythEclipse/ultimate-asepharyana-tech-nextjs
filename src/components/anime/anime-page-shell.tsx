"use client"

import { Suspense } from "react"
import { AnimeHubContent } from "./anime-hub-content"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/ui/section"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { SparklesCore } from "@/components/ui/sparkles"
import { IconPlayerPlay } from "@tabler/icons-react"
import { animePrefix, animeSearchRoute } from "@/lib/utils/routes"

type AnimePageShellProps = {
  source: 1 | 2
}

export function AnimePageShell({ source }: AnimePageShellProps) {
  const sourcePrefix = animePrefix(source)
  const searchRoute = animeSearchRoute(source)

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-500 pb-20">
      <div className="relative h-160 w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id={`particles-${sourcePrefix}`}
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={120}
            className="w-full h-full"
            particleColor="#ffffff"
          />
        </div>

        <div className="relative z-20 text-center px-4">
          <Badge variant="outline" className="mb-4 text-primary border-primary/50 bg-primary/5 px-4 py-1 animate-pulse">
            Anime List
          </Badge>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic text-foreground opacity-90">
            ANIME<span className="text-primary">HUB</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-sm md:text-base font-medium">
            Browse ongoing and completed anime updates.
          </p>

          <div className="mt-10 max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-accent rounded-2xl blur opacity-25 group-focus-within:opacity-60 transition duration-1000" />
            <form action={searchRoute} className="relative flex items-center bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-1 shadow-2xl transition-all">
              <div className="pl-4 text-muted-foreground/50">
                <IconPlayerPlay size={20} className="text-primary/50" />
              </div>
              <input
                type="text"
                name="q"
                placeholder="Search anime titles or episodes..."
                className="w-full bg-transparent border-none outline-none px-4 py-4 text-foreground placeholder:text-muted-foreground/30 font-bold"
              />
              <button className="bg-primary text-background px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all mr-1 shadow-lg shadow-primary/20">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <Section className="py-20">
        <Suspense fallback={<SkeletonGrid count={10} />}>
          <AnimeHubContent source={source} />
        </Suspense>
      </Section>
    </main>
  )
}
