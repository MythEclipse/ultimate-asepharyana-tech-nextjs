"use client"

import { notFound } from "next/navigation"
import { GlitchText } from "@/components/ui/glitch-text"
import { Heading } from "@/components/ui/heading"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { type AnimeFullData } from "@/lib/api/anime"
import { useAnimeStream } from "@/components/anime/use-anime"
import { parseSlugParam, useRouteParam } from "@/lib/utils/route-params"
import { animeWatchRoute } from "@/lib/utils/routes"

function AnimeStreamView({ data, source }: { data: AnimeFullData, source: 1 | 2 }) {
  return (
    <main className="min-h-screen bg-background text-foreground dark:bg-slate-950 dark:text-slate-100 relative selection:bg-primary/30 transition-colors duration-300">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-3xl opacity-15"
          style={{ backgroundImage: `url(${data.image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/80 to-transparent dark:from-slate-950/95 dark:via-slate-950/80" />
      </div>
      <Section className="relative z-10 pt-4 pb-4">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-0">
          <div className="glass rounded-3xl border border-border/20 p-4 md:p-6 shadow-xl">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <Heading as="h2" className="text-lg md:text-xl leading-tight">
                  <GlitchText text={data.episode} className="text-foreground" />
                </Heading>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs md:text-xs">
                    Now Playing
                  </Badge>
                  <Badge variant="outline" className="text-xs md:text-xs">
                    Episode
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Video Player Core */}
          <div className="mt-3 w-full bg-card/95 dark:bg-slate-900/85 rounded-3xl overflow-hidden shadow-2xl dark:shadow-black/40 border border-border/20 dark:border-slate-700 relative group transition-all duration-500 hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-700" />
            <div className="relative aspect-video w-full z-10 bg-black/95 dark:bg-slate-950/95">
              {data.stream_url ? (
                <iframe
                  src={data.stream_url}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  loading="lazy"
                />
              ) : (
                <div className="min-h-[25rem] flex items-center justify-center text-center text-muted-foreground/70 dark:text-slate-400 font-black tracking-widest uppercase">
                  Stream URL Unavailable
                </div>
              )}
            </div>
          </div>

          {/* Playback Controls & Navigation */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">

          {data.has_previous_episode && data.previous_episode ? (
            <Button
              href={animeWatchRoute(source, data.previous_episode.slug)}
              variant="outline"
              className="flex items-center justify-center gap-3 px-4 py-4 text-xs md:text-sm font-black uppercase tracking-wider rounded-2xl border border-border/20 dark:border-slate-600"
            >
              ←
              <span className="hidden sm:inline">Previous Episode</span>
              <span className="sm:hidden">Prev</span>
            </Button>
          ) : (
            <span className="flex items-center justify-center gap-3 px-4 py-4 border border-border/20 rounded-2xl bg-muted/20 dark:bg-slate-800 dark:border-slate-700 text-muted-foreground dark:text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider opacity-70">
              ←
              <span className="hidden sm:inline">Previous Episode</span>
              <span className="sm:hidden">Prev</span>
            </span>
          )}

          {data.has_next_episode && data.next_episode ? (
            <Button
              href={animeWatchRoute(source, data.next_episode.slug)}
              variant="premium"
              className="flex items-center justify-center gap-3 px-4 py-4 text-xs md:text-sm font-black uppercase tracking-wider rounded-2xl"
            >
              <span className="hidden sm:inline">Next Episode</span>
              <span className="sm:hidden">Next</span>
              →
            </Button>
          ) : (
            <span className="flex items-center justify-center gap-3 px-4 py-4 border border-border/20 rounded-2xl bg-muted/20 dark:bg-slate-800 dark:border-slate-700 text-muted-foreground dark:text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider opacity-70">
              <span className="hidden sm:inline">Next Episode</span>
              <span className="text-muted-foreground/50">→</span>
            </span>
          )}
        </div>

        {/* Download Matrix */}
        {data.download_urls && Object.keys(data.download_urls).length > 0 && (
          <div className="mt-16 space-y-8 pt-8 border-t border-border/20">
            <Heading as="h3" className="text-2xl text-center text-primary">
              Download Links
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Object.entries(data.download_urls).map(([resolution, links]) => (
                <Card key={resolution} className="p-5 bg-card border-border/20">
                  <div className="flex items-center gap-3 border-b border-border/10 pb-3 mb-3">
                    <Badge variant="outline" className="text-sm uppercase tracking-wider">
                      {resolution}
                    </Badge>
                    <span className="text-base font-black">Quality</span>
                  </div>
                  <div className="space-y-2">
                    {links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block px-3 py-2 rounded-xl bg-muted/10 hover:bg-primary/10 border border-border/10 text-xs font-semibold text-foreground transition-all"
                      >
                        {link.server}
                      </a>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      </Section>
    </main>
  )
}

export default function AnimeWatchPage({ source = 1 }: { source?: 1 | 2 }) {
  const slug = parseSlugParam(useRouteParam("slug"))

  if (!slug) {
    notFound()
  }

  const { data, isLoading } = useAnimeStream(source, slug)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!data) notFound()

  return <AnimeStreamView data={data} source={source} />
}
