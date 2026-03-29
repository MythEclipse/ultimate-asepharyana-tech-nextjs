"use client"

import { use, Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { fetchAnime1Ongoing, type Anime1OngoingItem } from "@/lib/api/anime"
import { type Pagination } from "@/lib/api/types"
import { cn } from "@/lib/utils/index"

// UI Components
import { Heading } from "@/components/ui/heading"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { SparklesCore } from "@/components/ui/sparkles"
import { IconArrowLeft, IconArrowRight, IconFlame } from "@tabler/icons-react"

function PaginationControl({ pagination, baseUrl }: { pagination: Pagination, baseUrl: string }) {
  const { current_page, has_next_page, has_previous_page, last_visible_page } = pagination
  
  return (
    <div className="flex items-center justify-center gap-4 mt-20 animate-fade-in">
      {has_previous_page ? (
        <Button 
          href={`${baseUrl}/${current_page - 1}`}
          variant="secondary"
          className="rounded-xl px-6 py-2 border border-border/10 hover:border-primary/50 transition-all font-black uppercase text-[10px] tracking-widest"
        >
          <IconArrowLeft size={16} className="mr-2" /> Previous
        </Button>
      ) : (
        <button disabled className="px-6 py-2 bg-muted/20 text-muted-foreground/30 rounded-xl font-black uppercase tracking-widest text-[10px] cursor-not-allowed">
           Previous
        </button>
      )}

      <div className="flex items-center gap-2 px-6 py-2 bg-card/40 backdrop-blur-md rounded-xl border border-border/10 font-bold text-xs uppercase tracking-tighter">
        Page <span className="text-primary">{current_page}</span> / {last_visible_page}
      </div>

      {has_next_page ? (
        <Button 
          href={`${baseUrl}/${current_page + 1}`}
          className="rounded-xl px-6 py-2 font-black uppercase text-[10px] tracking-widest"
        >
          Next <IconArrowRight size={16} className="ml-2" />
        </Button>
      ) : (
        <button disabled className="px-6 py-2 bg-muted/20 text-muted-foreground/30 rounded-xl font-black uppercase tracking-widest text-[10px] cursor-not-allowed">
           Next
        </button>
      )}
    </div>
  )
}

function OngoingAnimeCard({ item }: { item: Anime1OngoingItem }) {
  return (
    <Link href={`/anime/detail/${item.slug}`} className="group relative block h-full animate-slide-up">
       <Card className="relative p-0 overflow-hidden aspect-[3/4.2] border-white/5 group-hover:border-primary/50 transition-all duration-500 shadow-2xl">
        <Image 
          src={item.poster} 
          alt={item.title} 
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        <div className="absolute top-3 left-3">
           <Badge variant="glass" className="bg-orange-500/20 text-orange-500 border-orange-500/30 text-[9px] font-black uppercase">
             🔥 Ongoing
           </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/20 border border-primary/30 text-[9px] font-black uppercase text-primary">
             {item.current_episode}
          </div>
          <h3 className="text-sm md:text-base font-bold text-white leading-tight line-clamp-2 transition-colors group-hover:text-primary">
            {item.title}
          </h3>
        </div>
      </Card>
    </Link>
  )
}

function OngoingListContent({ page }: { page: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["anime-ongoing", page],
    queryFn: () => fetchAnime1Ongoing(page)
  })

  if (isLoading) return <SkeletonGrid count={10} />
  if (error || !data) return (
    <div className="p-20 text-center glass rounded-[3rem] border border-red-500/20">
        <Heading as="h3">Connectivity Disruption</Heading>
        <p className="text-muted-foreground mt-2">The neural uplink for ongoing series list failed.</p>
    </div>
  )

  return (
    <div className="space-y-20">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data.data.map((item, i) => (
          <OngoingAnimeCard key={item.slug || i} item={item} />
        ))}
      </div>
      <PaginationControl pagination={data.pagination} baseUrl="/anime/ongoing-anime" />
    </div>
  )
}

export default function Page({ 
  params 
}: { 
  params: Promise<{ page: string }> 
}) {
  const pageStr = use(params).page
  const page = parseInt(pageStr) || 1

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-40">
      <div className="relative h-[30rem] w-full flex flex-col items-center justify-center overflow-hidden">
        <SparklesCore
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full absolute inset-0 -z-10"
          particleColor="var(--color-primary)"
        />
        <div className="relative z-20 text-center px-4 space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
             <IconFlame size={14} className="animate-pulse" /> Live Uploads
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-foreground">
            ONGOING<span className="text-primary">ANIME</span>
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground/60 font-medium text-sm md:text-base tracking-wide">
             Monitoring the latest neural transmissions of active series worldwide.
          </p>
        </div>
      </div>

      <Section className="px-6 py-20">
         <div className="mb-12">
            <Link 
              href="/anime" 
              className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
            >
               <IconArrowLeft size={14} /> Back to Hub
            </Link>
         </div>

         <Suspense fallback={<SkeletonGrid count={10} />}>
            <OngoingListContent page={page} />
         </Suspense>
      </Section>
    </main>
  )
}
