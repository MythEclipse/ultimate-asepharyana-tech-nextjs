"use client"

import { use, Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { searchAnime1, type SearchAnimeItem } from "@/lib/api/anime"
import { CachedImage } from "@/components/ui/cached-image"

// UI
import { Heading } from "@/components/ui/heading"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconMoodSad } from "@tabler/icons-react"

function SearchHeader({ query, count }: { query: string, count: number }) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 mb-20 animate-fade-in">
      <Badge variant="glass" className="px-6 py-1.5 border-primary/20 text-primary uppercase tracking-[0.3em] font-black">
        Global Data Query
      </Badge>
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-foreground">
          Results for <span className="text-primary">&quot;{query}&quot;</span>
        </h1>
        <p className="text-muted-foreground font-medium tracking-widest text-sm uppercase opacity-50">
          Located {count} matching entries in primary cluster
        </p>
      </div>
      <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full" />
    </div>
  )
}

function AnimeSearchCard({ item, source, index }: { item: SearchAnimeItem, source: 1 | 2, index: number }) {
  const prefix = source === 2 ? "anime2" : "anime"
  
  return (
    <Link href={`/${prefix}/detail/${item.slug}`} className="group relative block h-full animate-slide-up">
      <Card className="relative p-0 overflow-hidden aspect-[3/4.2] border-border/10 group-hover:border-primary/50 transition-all duration-500 shadow-2xl">
        <CachedImage
          src={item.poster}
          alt={item.title}
          fill
          loading={index === 0 ? "eager" : "lazy"}
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        <div className="absolute top-3 right-3">
          <Badge variant="glass" className="text-[9px] uppercase font-black bg-white/5 border-white/10">
            {item.sub_info}
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/20 border border-primary/30 text-[9px] font-black uppercase text-primary">
             {item.info}
          </div>
          <h3 className="text-sm md:text-base font-bold text-white leading-tight line-clamp-2 transition-colors group-hover:text-primary">
            {item.title}
          </h3>
        </div>
      </Card>
    </Link>
  )
}

function SearchResults({ query, source }: { query: string, source: 1 | 2 }) {
  const { data, isLoading, error } = useQuery<SearchAnimeItem[]>({
    queryKey: ["anime-search", source, query],
    queryFn: () => searchAnime1(query), // Defaulting to searchAnime1, will split in anime2 route
    enabled: !!query
  })

  if (isLoading) return <SkeletonGrid count={10} />
  
  if (error || !data || data.length === 0) return (
    <div className="flex flex-col items-center justify-center p-20 glass rounded-[3rem] border border-border/10 animate-fade-in">
        <IconMoodSad size={80} className="text-muted-foreground/20 mb-6" />
        <Heading as="h3" className="text-2xl text-muted-foreground">Zero Matches Found</Heading>
        <p className="text-muted-foreground/60 mt-2 max-w-sm text-center font-medium">
            Our neural link couldn&apos;t locate any entries matching your query in the current sector.
        </p>
        <Button href="/anime" className="mt-8 rounded-2xl" variant="outline">
           <IconArrowLeft className="mr-2" /> Back to Hub
        </Button>
    </div>
  )

  return (
    <div className="space-y-20">
      <SearchHeader query={query} count={data.length} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data.map((item, i) => (
          <AnimeSearchCard key={item.slug || i} item={item} source={source} index={i} />
        ))}
      </div>
    </div>
  )
}

export default function AnimeSearchPage({ 
  searchParams, 
  source = 1 
}: { 
  searchParams: Promise<{ q?: string }>,
  source?: 1 | 2 
}) {
  const q = use(searchParams).q || ""

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-40">
       <Section className="pt-32 px-6">
          <div className="mb-12">
             <Link 
               href={source === 2 ? "/anime2" : "/anime"} 
               className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
             >
                <IconArrowLeft size={14} /> Back to Hub
             </Link>
          </div>

          <Suspense fallback={<SkeletonGrid count={10} />}>
             <SearchResults query={q} source={source} />
          </Suspense>
       </Section>
    </main>
  )
}
