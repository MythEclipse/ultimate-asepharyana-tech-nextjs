"use client"

import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import { ReactNode } from "react"

import { PaginationControl } from "@/components/shared/pagination-control"
import { EmptyState } from "@/components/ui/empty-state"
import { Heading } from "@/components/ui/heading"
import { Section } from "@/components/ui/section"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { Pagination } from "@/lib/api/types"

export interface HeroConfig {
  title: string
  accent: string
  description: string
  accentTextClass: string
  tagClass: string
  introText: string
  colorClass: string
  linkTextClass: string
}

interface MediaListPageProps<T> {
  isLoading: boolean
  data?: { data: T[]; pagination: Pagination }
  error: unknown
  queryName: string
  itemRenderer: (item: T, index: number) => ReactNode
  variant: "primary" | "indigo" | "red"
  baseUrl: string
  hubLink: string
  hero: HeroConfig
}

export function MediaListPage<T>({
  isLoading,
  data,
  error,
  queryName,
  itemRenderer,
  variant,
  baseUrl,
  hubLink,
  hero,
}: MediaListPageProps<T>) {
  if (isLoading) {
    return (
      <main className="min-h-screen text-foreground transition-colors duration-500 pb-40">
        <Section className="pt-32 pb-16" />
        <div className="px-6 py-12">
          <SkeletonGrid count={10} />
        </div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="min-h-screen text-foreground transition-colors duration-500 pb-40">
        <Section className="pt-24 pb-12" glow>
          <div className="glass rounded-3xl border border-border/20 p-10"> 
            <Heading as="h3">Failed to Load Data</Heading>
            <p className="text-muted-foreground mt-2">Could not load {queryName}.</p>
          </div>
        </Section>
      </main>
    )
  }

  if (data.data.length === 0) {
    return (
      <main className="min-h-screen text-foreground transition-colors duration-500 pb-40">
        <Section className="pt-24 pb-12" glow>
          <div className="mx-auto w-full max-w-4xl">
            <EmptyState
              title="Tidak ada item ditemukan"
              description={`Tidak ada hasil untuk ${queryName}. Coba pilih halaman lain atau tunggu data baru.`}
              variant="search"
              actionLabel="Reload"
              onAction={() => window.location.reload()}
            />
          </div>
        </Section>
      </main>
    )
  }

  return (
    <main className="min-h-screen text-foreground transition-colors duration-500 pb-40">
      <div className="relative h-120 w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-20 text-center px-4 space-y-6">
          <div className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full ${hero.tagClass} backdrop-blur-md border ${hero.colorClass} text-[10px] font-black uppercase tracking-[0.4em]`}>
            <IconArrowLeft size={14} className="animate-pulse" /> {hero.introText}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-foreground">
            {hero.title}<span className={hero.accentTextClass}>{hero.accent}</span>
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground/60 font-medium text-sm md:text-base tracking-wide">
             {hero.description}
          </p>
        </div>
      </div>

      <Section className="px-6 py-20">
         <div className="mb-12">
            <Link 
              href={hubLink} 
              className={`inline-flex items-center gap-2 ${hero.linkTextClass} hover:text-foreground transition-colors text-[10px] font-black uppercase tracking-[0.3em]`}>
               <IconArrowLeft size={14} /> Back
            </Link>
         </div>

         <div className="space-y-20">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
             {data.data.map((item, i) => (
               <div
                 key={i}
                 className="opacity-0 animate-fade-up"
                 style={{ animationDelay: `${i * 60}ms` }}
               >
                 {itemRenderer(item, i)}
               </div>
             ))}
           </div>
           <PaginationControl pagination={data.pagination} baseUrl={baseUrl} variant={variant} />
         </div>
      </Section>
    </main>
  )
}
