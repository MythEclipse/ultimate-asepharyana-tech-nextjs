"use client"

import { use, Suspense } from "react"
import Link from "next/link"
import { searchKomik, type MangaItem } from "@/lib/api/komik"
import { useMediaSearch } from "@/components/shared/use-media"

// UI
import { CachedImage } from "@/components/ui/cached-image"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { IconArrowLeft } from "@tabler/icons-react"
import { komikDetailRoute, komikHubRoute } from "@/lib/utils/routes"


function KomikSearchCard({ item, index }: { item: MangaItem; index: number }) {
  return (
    <Link href={komikDetailRoute(item.slug)} className="group relative block h-full animate-slide-up">
       <Card className="relative p-0 overflow-hidden aspect-[3/4.2] border-white/5 group-hover:border-orange-500/50 transition-all duration-500 shadow-2xl">
        <CachedImage
          src={item.poster}
          alt={item.title}
          fill
          loading={index === 0 ? "eager" : "lazy"}
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {item.score && (
            <Badge variant="glass" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-[10px]">
              ⭐ {item.score}
            </Badge>
          )}
          <Badge variant="glass" className="text-[9px] uppercase font-black tracking-widest bg-white/10">
            {item.type}
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/30 text-[9px] font-black uppercase text-orange-400">
             {item.chapter}
          </div>
          <h3 className="text-sm md:text-base font-bold text-white leading-tight line-clamp-2 transition-colors group-hover:text-orange-400">
            {item.title}
          </h3>
        </div>
      </Card>
    </Link>
  )
}

import { MediaSearchPage } from "@/components/shared/media-search-page"

function KomikSearchResults({ query }: { query: string }) {
  const { data, isLoading, error } = useMediaSearch<{ data: MangaItem[]; pagination: import("@/lib/api/types").Pagination }>(["komik-search", query], () => searchKomik(query, 1), !!query)

  return (
    <MediaSearchPage
      query={query}
      isLoading={isLoading}
      error={error}
      items={data?.data ?? []}
      count={data?.data.length ?? 0}
      primaryLabel="Found"
      accentLabel={query}
      hrefBack={komikHubRoute()}
      onRenderCard={(item, i) => <KomikSearchCard key={item.slug || i} item={item} index={i} />}
      emptyMessage="Zero Scrolls Located"
      emptyHelpText="Our archives do not contain any translated volumes matching your query."
    />
  )
}

export default function KomikSearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const q = use(searchParams).q || ""

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-40">
       <Section className="pt-32 px-6">
          <div className="mb-12">
             <Link 
               href={komikHubRoute()} 
               className="inline-flex items-center gap-2 text-orange-500 hover:text-foreground transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
             >
                <IconArrowLeft size={14} /> Back to Library
             </Link>
          </div>

          <Suspense fallback={<SkeletonGrid count={10} />}>
             <KomikSearchResults query={q} />
          </Suspense>
       </Section>
    </main>
  )
}
