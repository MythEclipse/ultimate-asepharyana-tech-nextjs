"use client"

import { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { fetchAnimeOngoing, fetchAnimeComplete, type AnimeSource, type Anime1OngoingItem, type Anime2OngoingItem, type Anime2CompleteItem } from "@/lib/api/anime"
import { Pagination } from "@/lib/api/types"
import { Section } from "@/components/ui/section"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { Heading } from "@/components/ui/heading"
import { SparklesCore } from "@/components/ui/sparkles"
import { IconArrowLeft, IconFlame, IconChecklist } from "@tabler/icons-react"
import { AnimeCard } from "./anime-card"
import { PaginationControl } from "./pagination-control"

interface AnimeListPageProps {
  source: AnimeSource
  page: number
  type: "ongoing" | "complete"
}

function ListContent({ source, page, type }: AnimeListPageProps) {
  const queryKey = [`anime-${type}`, source, page];

  type AnimeListResponse = { data: (Anime1OngoingItem | Anime2OngoingItem | Anime2CompleteItem)[]; pagination: Pagination }

  const { data, isLoading, error } = useQuery<AnimeListResponse, Error>({
    queryKey,
    queryFn: () => {
      if (type === "ongoing") {
        return fetchAnimeOngoing(source, page)
      }
      return fetchAnimeComplete(source, page)
    }
  })

  if (isLoading) return <SkeletonGrid count={10} />
  
  if (error || !data) return (
    <div className="p-20 text-center glass rounded-[3rem] border border-red-500/20">
        <Heading as="h3">Connectivity Disruption</Heading>
        <p className="text-muted-foreground mt-2">The neural uplink for {type} series list failed.</p>
    </div>
  )

  const prefix = source === 2 ? "anime2" : "anime";

  return (
    <div className="space-y-20">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data.data.map((item, i) => (
          <AnimeCard key={item.slug || i} item={item} prefix={prefix} />
        ))}
      </div>
      <PaginationControl pagination={data.pagination} baseUrl={`/${prefix}/${type}-anime`} />
    </div>
  )
}

export function AnimeListPage({ source, page, type }: AnimeListPageProps) {
  const isOngoing = type === "ongoing";
  const TitleIcon = isOngoing ? IconFlame : IconChecklist;
  const title = isOngoing ? "ONGOING" : "COMPLETE";
  const subtitle = isOngoing ? "ANIME" : "COLLECTION";
  const badge = isOngoing ? "Live Uploads" : "Archived Classics";
  const description = isOngoing 
    ? "Monitoring the latest neural transmissions of active series worldwide."
    : "Accessing the complete neural records of legendary concluded series.";

  const prefix = source === 2 ? "anime2" : "anime";

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
             <TitleIcon size={14} className={isOngoing ? "animate-pulse" : ""} /> {badge}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-foreground">
            {title}<span className="text-primary">{subtitle}</span>
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground/60 font-medium text-sm md:text-base tracking-wide">
             {description}
          </p>
        </div>
      </div>

      <Section className="px-6 py-20">
         <div className="mb-12">
            <Link 
              href={`/${prefix}`}
              className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
            >
               <IconArrowLeft size={14} /> Back to Hub
            </Link>
         </div>

         <Suspense fallback={<SkeletonGrid count={10} />}>
            <ListContent source={source} page={page} type={type} />
         </Suspense>
      </Section>
    </main>
  )
}
