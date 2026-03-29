"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils/index"
import { CachedImage } from "@/components/ui/cached-image"

// API & UI
import { fetchManga, fetchManhwa, fetchManhua, type MangaItem } from "@/lib/api/komik"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { SparklesCore } from "@/components/ui/sparkles"
import { IconBook, IconDiamond, IconBarbell, IconArrowRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

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
      <Button href={link} variant="outline" size="sm" className="rounded-xl border-border/40 hover:bg-muted transition-all">
        Explore Archive <IconArrowRight size={14} className="ml-2" />
      </Button>
    </div>
  )
}

function KomikCard({ item }: { item: MangaItem }) {
  return (
    <Link href={`/komik/detail/${item.slug}`} className="group relative block h-full">
       <Card className="relative p-0 overflow-hidden aspect-[3/4.2] border-white/5 group-hover:border-orange-500/50 transition-all duration-500">
        <CachedImage
          src={item.poster}
          alt={item.title}
          fill
          loading="lazy"
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
          <h3 className="text-sm md:text-base font-bold text-foreground leading-tight line-clamp-2 transition-colors group-hover:text-orange-400">
            {item.title}
          </h3>
        </div>
      </Card>
    </Link>
  )
}

function KomikIndexContent() {
  const { data: manga } = useQuery({ queryKey: ["manga"], queryFn: () => fetchManga(1) })
  const { data: manhwa } = useQuery({ queryKey: ["manhwa"], queryFn: () => fetchManhwa(1) })
  const { data: manhua } = useQuery({ queryKey: ["manhua"], queryFn: () => fetchManhua(1) })

  if (!manga || !manhwa || !manhua) return <SkeletonGrid count={12} />

  return (
    <TracingBeam className="px-6">
      <div className="space-y-32 py-10">
        <section id="manga">
          <SectionHeader title="Manga &bull; JP" icon={IconBook} color="bg-orange-600" link="/komik/manga/1" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {manga.data.slice(0, 10).map((item: MangaItem, i: number) => (
              <KomikCard key={item.slug || i} item={item} />
            ))}
          </div>
        </section>

        <section id="manhwa">
          <SectionHeader title="Manhwa &bull; KR" icon={IconDiamond} color="bg-blue-600" link="/komik/manhwa/1" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {manhwa.data.slice(0, 10).map((item: MangaItem, i: number) => (
              <KomikCard key={item.slug || i} item={item} />
            ))}
          </div>
        </section>

        <section id="manhua">
          <SectionHeader title="Manhua &bull; CN" icon={IconBarbell} color="bg-emerald-600" link="/komik/manhua/1" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {manhua.data.slice(0, 10).map((item: MangaItem, i: number) => (
              <KomikCard key={item.slug || i} item={item} />
            ))}
          </div>
        </section>
      </div>
    </TracingBeam>
  )
}

export default function KomikPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-orange-500/30 transition-colors duration-500">
      <div className="relative h-[35rem] w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="particles-komik"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#f97316"
          />
        </div>
        <div className="relative z-20 text-center px-4">
          <Badge variant="outline" className="mb-4 text-orange-500 border-orange-500/50 bg-orange-500/5 px-4 py-1">
            Universal Reading Library
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-foreground">
            KOMIK<span className="text-orange-500">INDEX</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
            Explore thousands of translated chapters with high-fidelity imagery and fluid navigation.
          </p>

          <div className="mt-10 max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000" />
            <form action="/komik/search" className="relative flex items-center bg-card border border-border rounded-2xl p-1 transition-colors duration-500">
              <div className="pl-4 text-muted-foreground">
                <IconBook size={20} className="text-orange-500/50" />
              </div>
              <input 
                type="text" 
                name="q"
                placeholder="Search manga, manhwa..." 
                className="w-full bg-transparent border-none outline-none px-4 py-4 text-foreground placeholder:text-muted-foreground/50 font-bold"
              />
              <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all mr-1">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <Section className="py-20">
        <Suspense fallback={<SkeletonGrid count={10} />}>
          <KomikIndexContent />
        </Suspense>
      </Section>
    </main>
  )
}
