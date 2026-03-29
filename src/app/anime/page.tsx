"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils/index"
import { CachedImage } from "@/components/ui/cached-image"

// Tech Stack & UI
import { 
    type Anime1OngoingItem, 
    type Anime2OngoingItem, 
    type Anime2CompleteItem, 
    type Anime1Data, 
    type Anime2Data,
    fetchAnime1Index,
    fetchAnime2Index 
} from "@/lib/api/anime"
import { Heading } from "@/components/ui/heading"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/ui/section"
import { Card } from "@/components/ui/card"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { SparklesCore } from "@/components/ui/sparkles"
import { IconArrowRight, IconFlame, IconSparkles, IconSearch } from "@tabler/icons-react"

type AnimeItem = Anime1OngoingItem | Anime2OngoingItem | Anime2CompleteItem

function SectionHeader({ title, icon: Icon, color, link }: { title: string, icon: React.ElementType, color: string, link: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-4">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
          <Icon size={24} />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground">{title}</h2>
          <div className={cn("h-1 w-20 mt-2 rounded-full", color)} />
        </div>
      </div>
      <Button href={link} variant="outline" size="sm">
        Explore All <IconArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

function AnimeCard({ item, source, index }: { item: AnimeItem, index: number, source: 1 | 2 }) {
  const prefix = source === 2 ? "anime2" : "anime"
  const hasEpisode = 'current_episode' in item && !!item.current_episode
  const hasScore = 'score' in item && !!item.score
  const hasCount = 'episode_count' in item && !!item.episode_count

  return (
    <Link href={`/${prefix}/detail/${item.slug}`} className="group relative block h-full">
      <Card className="relative p-0 overflow-hidden aspect-[3/4.2] border-white/5 group-hover:border-primary/50 transition-all duration-500">
        <CachedImage
          src={item.poster}
          alt={item.title}
          fill
          eager={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {hasScore && (
            <Badge variant="glass" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-[10px]">
              ⭐ {item.score}
            </Badge>
          )}
          {hasCount && (
            <Badge variant="glass" className="text-[9px] uppercase font-black">
              {item.episode_count} EPS
            </Badge>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          {hasEpisode && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/20 border border-primary/30 text-[9px] font-black uppercase text-primary">
               {item.current_episode}
            </div>
          )}
          <h3 className="text-sm md:text-base font-bold text-foreground leading-tight line-clamp-2 transition-colors group-hover:text-primary">
            {item.title}
          </h3>
        </div>
      </Card>
    </Link>
  )
}

function AnimeIndexContent({ source }: { source: 1 | 2 }) {
  const { data, isLoading, error } = useQuery<Anime1Data | Anime2Data>({
      queryKey: ["anime-index", source],
      queryFn: async () => {
          if (source === 2) return fetchAnime2Index()
          return fetchAnime1Index()
      }
  })

  if (isLoading) return <SkeletonGrid count={12} />
  if (error || !data) return (
      <Card className="p-12 text-center border-red-500/20">
          <div className="text-4xl mb-4">❌</div>
          <Heading as="h3">Connection Error</Heading>
          <p className="text-muted-foreground mt-2">Unable to load anime database. Please try again later.</p>
      </Card>
  )

  const prefix = source === 2 ? "anime2" : "anime"
    
  return (
    <TracingBeam className="px-6">
      <div className="space-y-32 py-10">
        <section>
          <SectionHeader
            title="Ongoing Series"
            icon={IconFlame}
            color="bg-orange-600"
            link={`/${prefix}/ongoing-anime/1`}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {data.ongoing_anime.slice(0, 10).map((item, i) => (
              <AnimeCard key={item.slug || i} item={item} index={i} source={source} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Complete Library"
            icon={IconSparkles}
            color="bg-purple-600"
            link={`/${prefix}/complete-anime/1`}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {data.complete_anime.slice(0, 10).map((item, i) => (
              <AnimeCard key={item.slug || i} item={item} index={i} source={source} />
            ))}
          </div>
        </section>
      </div>
    </TracingBeam>
  )
}

export const dynamic = "force-dynamic"

export default function AnimePage({ source = 1 }: { source?: 1 | 2 }) {
  const sourceTitle = source === 2 ? "Mirror Source" : "Primary Source"
  
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-500">
      <div className="relative h-[40rem] w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="var(--color-primary)"
          />
        </div>
        <div className="relative z-20 text-center px-4">
          <Badge variant="outline" className="mb-4 text-primary border-primary/50 bg-primary/5 px-4 py-1">
            Media Hub &bull; {sourceTitle}
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-foreground">
            ANIME<span className="text-primary">HUB</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
            Stream your favorite series with high-performance delivery and immersive interface.
          </p>
          
          <div className="mt-10 max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000" />
            <form action={`/anime${source === 2 ? '2' : ''}/search`} className="relative flex items-center bg-card border border-border rounded-2xl p-1 transition-colors duration-500">
              <div className="pl-4 text-muted-foreground">
                <IconSearch size={20} />
              </div>
              <input 
                type="text" 
                name="q"
                placeholder="Search titles..." 
                className="w-full bg-transparent border-none outline-none px-4 py-4 text-foreground placeholder:text-muted-foreground/50 font-bold"
              />
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all mr-1">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <Section className="py-20">
        <Suspense fallback={<SkeletonGrid count={10} />}>
          <AnimeIndexContent source={source} />
        </Suspense>
      </Section>
    </main>
  )
}
