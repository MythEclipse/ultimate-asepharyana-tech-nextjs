"use client"

import { use } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchKomikDetail, type KomikDetailData } from "@/lib/api/komik"
import { CachedImage } from "@/components/ui/cached-image"

// UI components
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { 
  IconCalendar, 
  IconUsers, 
  IconBook,
  IconClock,
  IconArrowLeft,
  IconPlayerPlay
} from "@tabler/icons-react"

// --- Internal Helper Components ---

function DetailInfo({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) {
  if (!value || value === "Unknown") return null;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/10 last:border-0 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500/80 shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>
        <span className="text-sm font-bold text-foreground">{value}</span>
      </div>
    </div>
  )
}

function KomikDetailContentBody({ data }: { data: KomikDetailData }) {
  return (
    <div className="min-h-screen bg-background text-foreground pb-32 transition-colors duration-500">
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
            <div className="w-full lg:w-1/3 xl:w-80 shrink-0 flex flex-col gap-8">
              <Card className="relative p-0 overflow-hidden aspect-[3/4.2] border-white/10 group shadow-2xl">
                <CachedImage
                  src={data.poster}
                  alt={data.title}
                  fill
                  eager
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </Card>

              <Card className="p-6 bg-card border-border/50">
                <DetailInfo icon={IconUsers} label="Status" value={data.status} />
                <DetailInfo icon={IconBook} label="Type" value={data.type} />
                <DetailInfo icon={IconCalendar} label="Author" value={data.author} />
                <DetailInfo icon={IconClock} label="Updated" value={data.updated_on} />
              </Card>
            </div>

            <div className="flex-1 max-w-4xl pt-4">
              <header className="space-y-6 mb-12">
                <div className="flex items-center gap-4">
                    <Button href="/komik" variant="ghost" size="sm" className="rounded-full px-4 border border-border/20">
                       <IconArrowLeft size={16} className="mr-2" /> Back
                    </Button>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none italic text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-orange-500">
                  {data.title}
                </h1>
                <div className="flex flex-wrap gap-2 pt-4">
                  {data.genres?.map((genre) => (
                    <Badge key={genre} variant="glass" className="px-4 py-1.5 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer text-[10px] uppercase font-black tracking-widest bg-orange-500/10 border-orange-500/20">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </header>

              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-6 h-1 bg-orange-500 rounded-full" />
                    Storyline
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium transition-colors">
                    {data.description}
                  </p>
                </div>

                <div className="pt-12 border-t border-border/10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl md:text-3xl font-black text-foreground px-2 transition-colors">Chapter Repository</h3>
                    <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30 uppercase text-[10px]">
                      {data.chapters?.length || 0} Records
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {data.chapters?.map((ch) => (
                      <Link 
                        key={ch.chapter_id} 
                        href={`/komik/chapter/${ch.chapter_id}`}
                        className="group relative flex items-center justify-between p-4 rounded-xl bg-muted/5 border border-border/10 hover:border-orange-500/40 transition-all hover:bg-orange-500/5 overflow-hidden"
                      >
                        <span className="relative z-10 text-xs font-black text-muted-foreground group-hover:text-orange-500 transition-colors truncate pr-4">
                          {ch.chapter}
                        </span>
                        <div className="relative z-10 w-8 h-8 rounded-lg bg-background/40 flex items-center justify-center border border-border/20 group-hover:border-orange-500/40 group-hover:text-orange-500 transition-all shrink-0">
                          <IconPlayerPlay size={12} className="translate-x-0.5" />
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

// --- Route Component ---

export default function KomikDetailRoute({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const normalizedSlug = slug?.trim() || ""

  if (!normalizedSlug) {
    notFound()
  }

  const { data, isLoading, error } = useQuery<KomikDetailData>({
    queryKey: ["komik-detail", normalizedSlug],
    queryFn: () => fetchKomikDetail(normalizedSlug),
    enabled: Boolean(normalizedSlug),
  })

  if (error) {
    notFound()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-500">
        <div className="w-16 h-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!data) notFound()

  return <KomikDetailContentBody data={data} />
}
