"use client"

import { use, Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { searchKomik, type MangaItem } from "@/lib/api/komik"

// UI
import { Heading } from "@/components/ui/heading"
import { CachedImage } from "@/components/ui/cached-image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconMoodSad } from "@tabler/icons-react"

function SearchHeader({ query, count }: { query: string, count: number }) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 mb-20 animate-fade-in">
      <Badge variant="glass" className="px-6 py-1.5 border-orange-500/20 text-orange-500 uppercase tracking-[0.3em] font-black">
        Visual Library Query
      </Badge>
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-foreground">
          Found <span className="text-orange-500">&quot;{query}&quot;</span>
        </h1>
        <p className="text-muted-foreground font-medium tracking-widest text-sm uppercase opacity-50">
          Identified {count} translated scrolls in local archives
        </p>
      </div>
      <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-orange-400 mx-auto rounded-full" />
    </div>
  )
}

function KomikSearchCard({ item, index }: { item: MangaItem; index: number }) {
  return (
    <Link href={`/komik/detail/${item.slug}`} className="group relative block h-full animate-slide-up">
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

function KomikSearchResults({ query }: { query: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["komik-search", query],
    queryFn: () => searchKomik(query, 1),
    enabled: !!query
  })

  if (isLoading) return <SkeletonGrid count={10} />
  
  if (error || !data || !data.data || data.data.length === 0) return (
    <div className="flex flex-col items-center justify-center p-20 glass rounded-[3rem] border border-border/10 animate-fade-in">
        <IconMoodSad size={80} className="text-muted-foreground/20 mb-6" />
        <Heading as="h3" className="text-2xl text-muted-foreground font-black uppercase italic tracking-tighter">Zero Scrolls Located</Heading>
        <p className="text-muted-foreground/60 mt-2 max-w-sm text-center font-medium">
            Our archives do not contain any translated volumes matching your query.
        </p>
        <Button href="/komik" className="mt-8 rounded-2xl bg-orange-500 hover:bg-orange-600 border-none transition-all">
           <IconArrowLeft className="mr-2" /> Back to Index
        </Button>
    </div>
  )

  return (
    <div className="space-y-20">
      <SearchHeader query={query} count={data.data.length} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data.data.map((item, i) => (
          <KomikSearchCard key={item.slug || i} item={item} index={i} />
        ))}
      </div>
    </div>
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
               href="/komik" 
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
