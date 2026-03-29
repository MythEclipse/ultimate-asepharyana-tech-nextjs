"use client"

import { use } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { GlitchText } from "@/components/ui/glitch-text"
import { Heading } from "@/components/ui/heading"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { type AnimeFullData, fetchAnime1Stream, fetchAnime2Stream } from "@/lib/api/anime"

function AnimeStreamView({ data, source }: { data: AnimeFullData, source: 1 | 2 }) {
  const prefix = source === 2 ? "anime2" : "anime"

  return (
    <main className="min-h-screen bg-background relative selection:bg-primary/30">
      {/* Immersive Background */}
      <div className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[60px] opacity-20 scale-110"
          style={{ backgroundImage: `url(${data.image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
      </div>

      <Section className="pt-32 pb-24 relative z-10 w-full max-w-6xl">
        <header className="mb-8 space-y-4">
          <Link 
            href={`/${prefix}/detail/${data.anime.slug}`}
            className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
          >
            ← Back to Series
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <Heading as="h1" className="text-3xl md:text-5xl">
              <GlitchText text={data.episode} className="text-foreground" />
            </Heading>
          </div>
        </header>

        {/* Video Player Core */}
        <div className="w-full bg-card rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] dark:shadow-none border border-border/20 relative group transition-colors duration-500">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-1000 z-0" />
          <div className="relative aspect-video w-full z-10 bg-muted/10 flex items-center justify-center">
            {data.stream_url ? (
              <iframe 
                src={data.stream_url} 
                className="w-full h-full border-0" 
                allowFullScreen 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy"
              />
            ) : (
                <div className="text-center text-muted-foreground/50 font-black tracking-widest uppercase">
                    Stream URL Unavailable
                </div>
            )}
          </div>
        </div>

        {/* Playback Controls & Navigation */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {data.has_previous_episode && data.previous_episode ? (
            <Button 
                href={`/${prefix}/watch/${data.previous_episode.slug}`}
                variant="secondary"
                className="flex items-center justify-center gap-3"
            >
              <span className="text-primary group-hover:-translate-x-1 transition-transform">←</span> 
              <span className="hidden sm:inline">Previous Episode</span>
              <span className="sm:hidden">Prev</span>
            </Button>
          ) : (
            <button disabled className="flex items-center justify-center gap-3 px-4 py-5 glass border border-border/10 rounded-2xl opacity-50 cursor-not-allowed font-black uppercase tracking-widest text-xs md:text-sm text-muted-foreground shadow-inner">
              <span className="text-muted-foreground/50">←</span> 
              <span className="hidden sm:inline">Previous Episode</span>
              <span className="sm:hidden">Prev</span>
            </button>
          )}

          {data.has_next_episode && data.next_episode ? (
            <Button 
              href={`/${prefix}/watch/${data.next_episode.slug}`}
              className="flex items-center justify-center gap-3 h-full"
            >
              <span className="hidden sm:inline">Next Episode</span>
              <span className="sm:hidden">Next</span> 
              <span className="text-background group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          ) : (
            <button disabled className="flex items-center justify-center gap-3 px-4 py-5 glass border border-border/10 rounded-2xl opacity-50 cursor-not-allowed font-black uppercase tracking-widest text-xs md:text-sm text-muted-foreground shadow-inner">
              <span className="hidden sm:inline">Next Episode</span>
              <span className="text-muted-foreground/50">→</span>
            </button>
          )}
        </div>

        {/* Download Matrix */}
        {data.download_urls && Object.keys(data.download_urls).length > 0 && (
          <div className="mt-16 space-y-8">
            <Heading as="h3" className="text-2xl text-center drop-shadow-xl">Resolution Matrix</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(data.download_urls).map(([resolution, links]) => (
                <Card key={resolution} className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-border/10 pb-4">
                    <Badge variant="glass">RES</Badge>
                    <span className="text-lg font-black">{resolution}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {links.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-muted/50 hover:bg-primary/20 hover:text-primary border border-border/20 rounded-xl text-xs font-bold transition-colors"
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
      </Section>
    </main>
  )
}

export default function AnimeWatchPage({ 
  params, 
  source = 1 
}: { 
  params: Promise<{ slug: string }>,
  source?: 1 | 2 
}) {
  const { slug } = use(params)
  const { data, isLoading } = useQuery<AnimeFullData>({
    queryKey: ["anime-watch", source, slug],
    queryFn: async () => {
      if (source === 2) return fetchAnime2Stream(slug)
      return fetchAnime1Stream(slug)
    }
  })

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
