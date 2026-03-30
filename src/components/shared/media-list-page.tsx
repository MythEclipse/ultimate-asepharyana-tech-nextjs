"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { Section } from "@/components/ui/section"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { Heading } from "@/components/ui/heading"
import { SparklesCore } from "@/components/ui/sparkles"
import { IconArrowLeft } from "@tabler/icons-react"
import { PaginationControl } from "@/components/shared/pagination-control"
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
  if (isLoading) return <SkeletonGrid count={10} />

  if (error || !data) {
    return (
      <div className="p-20 text-center glass rounded-[3rem] border border-border/20">
        <Heading as="h3">Connectivity Disruption</Heading>
        <p className="text-muted-foreground mt-2">The neural uplink for {queryName} library failed.</p>
      </div>
    )
  }

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
               <IconArrowLeft size={14} /> Back to Hub
            </Link>
         </div>

         <div className="space-y-20">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
             {data.data.map((item, i) => (
               <div key={i}>{itemRenderer(item, i)}</div>
             ))}
           </div>
           <PaginationControl pagination={data.pagination} baseUrl={baseUrl} variant={variant} />
         </div>
      </Section>
    </main>
  )
}
