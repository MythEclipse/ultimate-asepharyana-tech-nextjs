"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils/index"
import { CachedImage } from "@/components/ui/cached-image"

// API & UI
import { fetchAnime2Ongoing, fetchAnime2Complete } from "@/lib/api/anime"

interface AnimeItem {
  title: string;
  slug: string;
  poster: string;
  episode?: string;
  score?: string;
  type?: string;
}

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { SparklesCore } from "@/components/ui/sparkles"
import { IconFlame, IconChecklist, IconPlayerPlay, IconArrowRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

function SectionHeader({ title, icon: Icon, color, link }: { title: string, icon: React.ElementType, color: string, link: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-4">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
          <Icon size={24} />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight">{title}</h2>
          <div className={cn("h-1.5 w-20 mt-2 rounded-full", color)} />
        </div>
      </div>
      <Button href={link} variant="outline" size="sm" className="rounded-xl border-border/40 hover:bg-muted transition-all">
        View Full List <IconArrowRight size={14} className="ml-2" />
      </Button>
    </div>
  )
}

function AnimeCard({ item, prefix }: { item: AnimeItem, prefix: string }) {
  return (
    <Link href={`/${prefix}/detail/${item.slug}`} className="group relative block h-full">
      <Card className="relative p-0 overflow-hidden aspect-[3/4.2] border-white/5 group-hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
        <CachedImage
          src={item.poster}
          alt={item.title}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {item.score && (
            <Badge variant="glass" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-[10px] font-black">
              ⭐ {item.score}
            </Badge>
          )}
          <Badge variant="glass" className="text-[9px] uppercase font-black tracking-widest bg-white/10 backdrop-blur-md">
            {item.type}
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/20 border border-primary/30 text-[9px] font-black uppercase text-primary">
             {item.episode}
          </div>
          <h3 className="text-sm md:text-base font-bold text-foreground leading-tight line-clamp-2 transition-colors group-hover:text-primary">
            {item.title}
          </h3>
          <div className="pt-2 flex items-center gap-4 text-[10px] text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="flex items-center gap-1"><IconPlayerPlay size={10} /> Watch Now</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

function AnimeHubContent({ source }: { source: 1 | 2 }) {
  const { data: ongoing } = useQuery({ queryKey: ["ongoing", source], queryFn: () => fetchAnime2Ongoing(1) })
  const { data: complete } = useQuery({ queryKey: ["complete", source], queryFn: () => fetchAnime2Complete(1) })

  const prefix = source === 2 ? "anime2" : "anime"

  if (!ongoing || !complete) return <SkeletonGrid count={12} />

  return (
    <TracingBeam className="px-6">
      <div className="space-y-32 py-10">
        <section id="ongoing">
          <SectionHeader title="Hot Ongoing" icon={IconFlame} color="bg-orange-600" link={`/${prefix}/ongoing-anime/1`} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
            {ongoing.data.slice(0, 10).map((item: AnimeItem, i: number) => (
              <AnimeCard key={item.slug || i} item={item} prefix={prefix} />
            ))}
          </div>
        </section>

        <section id="complete">
          <SectionHeader title="Legendary Completed" icon={IconChecklist} color="bg-blue-600" link={`/${prefix}/complete-anime/1`} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
            {complete.data.slice(0, 10).map((item: AnimeItem, i: number) => (
              <AnimeCard key={item.slug || i} item={item} prefix={prefix} />
            ))}
          </div>
        </section>
      </div>
    </TracingBeam>
  )
}

export default function Anime2Page() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-500 pb-20">
      {/* Hero Section */}
      <div className="relative h-[40rem] w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="particles-anime2"
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
            Premium Anime Collection
          </Badge>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic text-foreground opacity-90">
            ANIME<span className="text-primary">HUB</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-sm md:text-base font-medium">
            Dive into high-definition streaming and real-time updates from our massive library of ongoing and completed series.
          </p>

          <div className="mt-10 max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-focus-within:opacity-60 transition duration-1000" />
            <form action="/anime2/search" className="relative flex items-center bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-1 shadow-2xl transition-all">
              <div className="pl-4 text-muted-foreground/50">
                <IconPlayerPlay size={20} className="text-primary/50" />
              </div>
              <input 
                type="text" 
                name="q"
                placeholder="Search series, episodes..." 
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
          <AnimeHubContent source={2} />
        </Suspense>
      </Section>
    </main>
  )
}
