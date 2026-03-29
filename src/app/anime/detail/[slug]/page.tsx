"use client"

import { use } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchAnime1Detail, fetchAnime2Detail, type AnimeDetailData } from "@/lib/api/anime"
import { CachedImage } from "@/components/ui/cached-image"

// UI components
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { 
  IconPlayerPlay, 
  IconStar, 
  IconCalendar, 
  IconUsers, 
  IconBuildingSkyscraper,
  IconClock
} from "@tabler/icons-react"

function DetailInfo({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) {
  if (!value || value === "Unknown") return null;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/10 last:border-0 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-primary/80 shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>
        <span className="text-sm font-bold text-foreground">{value}</span>
      </div>
    </div>
  )
}

function AnimeDetailContent({ data, source }: { data: AnimeDetailData, source: 1 | 2 }) {
  const prefix = source === 2 ? "anime2" : "anime"

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 transition-colors duration-500">
      {/* Cinematic Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[70vh] pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-3xl opacity-20 scale-110"
          style={{ backgroundImage: `url(${data.poster})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <Section className="relative z-10 pt-40 px-6">
        <TracingBeam className="px-6 md:px-0">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Sidebar Portion */}
            <div className="w-full lg:w-1/3 xl:w-80 shrink-0 flex flex-col gap-8">
              <Card className="relative p-0 overflow-hidden aspect-[3/4.2] border-white/10 group shadow-2xl transition-transform duration-500">
                <CachedImage
                  src={data.poster}
                  alt={data.title}
                  fill
                  eager
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </Card>

              <Card className="p-6 bg-card border-border/50">
                <DetailInfo icon={IconStar} label="Score" value={data.score} />
                <DetailInfo icon={IconCalendar} label="Released" value={data.release_date} />
                <DetailInfo icon={IconUsers} label="Status" value={data.status || undefined} />
                <DetailInfo icon={IconPlayerPlay} label="Type" value={data.type || undefined} />
                <DetailInfo icon={IconBuildingSkyscraper} label="Studio" value={data.studio} />
                <DetailInfo icon={IconClock} label="Duration" value={"duration" in data ? (data as { duration: string }).duration : "N/A"} />
              </Card>
            </div>

            {/* Content Portion */}
            <div className="flex-1 max-w-4xl pt-4">
              <header className="space-y-6 mb-12">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none italic text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground/50">
                  {data.title}
                </h1>
                {data.alternative_title && (
                  <h2 className="text-xl md:text-2xl text-muted-foreground/60 font-medium italic tracking-tight">
                    {data.alternative_title}
                  </h2>
                )}
                <div className="flex flex-wrap gap-2 pt-4">
                  {data.genres?.map((genre) => (
                    <Badge key={genre.slug} variant="glass" className="px-4 py-1.5 hover:bg-primary transition-colors cursor-pointer text-[10px] uppercase font-black">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </header>

              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <div className="w-6 h-1 bg-primary rounded-full" />
                    Synopsis
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    {data.synopsis}
                  </p>
                </div>

                {/* Episode List */}
                <div className="pt-12 border-t border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl md:text-3xl font-black text-foreground">Episodes Library</h3>
                    <Badge variant="outline" className="text-primary border-primary/30 uppercase text-[10px]">
                      {data.episode_lists?.length || 0} Total Units
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {data.episode_lists?.map((ep) => (
                      <Link 
                        key={ep.slug} 
                        href={`/${prefix}/watch/${ep.slug}`}
                        className="group relative flex items-center justify-between p-4 rounded-2xl bg-muted/5 border border-border/10 hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-95 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 text-xs font-black text-foreground/80 group-hover:text-primary transition-colors line-clamp-1 pr-4">
                          {ep.episode}
                        </span>
                        <div className="relative z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center border border-white/10 group-hover:border-primary/40 group-hover:text-primary transition-all shrink-0">
                          <IconPlayerPlay size={14} className="translate-x-0.5" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TracingBeam>
      </Section>
    </div>
  )
}

export default function AnimeDetailRoute({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>, 
  searchParams?: Promise<{ s?: string }> 
}) {
  const { slug } = use(params)
  const s = searchParams ? use(searchParams).s : "1"
  const source = s === "2" ? 2 : 1

  const { data, isLoading } = useQuery<AnimeDetailData>({
    queryKey: ["anime-detail", slug, source],
    queryFn: () => source === 2 ? fetchAnime2Detail(slug) : fetchAnime1Detail(slug)
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!data) notFound()

  return <AnimeDetailContent data={data} source={source as 1 | 2} />
}
