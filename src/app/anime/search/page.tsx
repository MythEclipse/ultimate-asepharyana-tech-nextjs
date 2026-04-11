"use client"

import { use, Suspense } from "react"
import Link from "next/link"
import { searchAnime, type SearchAnimeItem } from "@/lib/api/anime"
import { useMediaSearch } from "@/components/shared/use-media"
import { CachedImage } from "@/components/ui/cached-image"

// UI
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { IconArrowLeft } from "@tabler/icons-react"
import { animeDetailRoute, animeHubRoute } from "@/lib/utils/routes"

function AnimeSearchCard({ item, source, index }: { item: SearchAnimeItem, source: 1 | 2, index: number }) {
  return (
    <Link href={animeDetailRoute(source, item.slug)} className="group relative block h-full animate-slide-up">
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

import { MediaSearchResults } from "@/components/shared/media-search-results"

function SearchResults({ query, source }: { query: string; source: 1 | 2 }) {
  const { data, isLoading, error } = useMediaSearch<SearchAnimeItem[]>(["anime-search", source, query], () => searchAnime(source, query), query.trim().length > 0)

  return (
    <MediaSearchResults
      query={query}
      isLoading={isLoading}
      error={error}
      items={data || []}
      count={data?.length ?? 0}
      primaryLabel="Results for"
      accentLabel={query}
      hrefBack={animeHubRoute(source)}
      onRenderCard={(item, i) => <AnimeSearchCard key={(item as SearchAnimeItem).slug || i} item={item as SearchAnimeItem} source={source} index={i} />}
      emptyMessage="No results found"
      emptyHelpText="Try another keyword."
    />
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
               href={animeHubRoute(source)} 
               className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
             >
                <IconArrowLeft size={14} /> Back to Anime
             </Link>
          </div>

          <SearchResults query={q} source={source} />
       </Section>
    </main>
  )
}
