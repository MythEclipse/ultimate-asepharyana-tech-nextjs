"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { type AnimeDetailData } from "@/lib/api/anime"
import { useAnimeDetail } from "@/components/anime/use-anime"
import { parseSlugParam, useRouteParam } from "@/lib/utils/route-params"
import { animeHubRoute, animeWatchRoute } from "@/lib/utils/routes"

import { 
  IconPlayerPlay, 
  IconStar, 
  IconCalendar, 
  IconUsers, 
  IconBuildingSkyscraper,
  IconClock
} from "@tabler/icons-react"
import { MediaDetailShell, type MediaDetailEntry } from "@/components/shared/media-detail-shell"


function AnimeDetailContent({ data, source }: { data: AnimeDetailData; source: 1 | 2 }) {
  const entries: MediaDetailEntry[] = (data.episode_lists ?? []).map((ep) => ({
    id: ep.slug,
    label: ep.episode,
    href: animeWatchRoute(source, ep.slug),
  }))

  return (
    <MediaDetailShell
      backgroundImage={data.poster}
      posterUrl={data.poster}
      title={data.title}
      subtitle={data.alternative_title ?? ""}
      genres={data.genres?.map((g) => g.name) ?? []}
      metaItems={[
        { icon: IconStar, label: "Score", value: data.score },
        { icon: IconCalendar, label: "Released", value: data.release_date },
        { icon: IconUsers, label: "Status", value: data.status ?? undefined },
        { icon: IconPlayerPlay, label: "Type", value: data.type ?? undefined },
        { icon: IconBuildingSkyscraper, label: "Studio", value: data.studio },
        { icon: IconClock, label: "Duration", value: "duration" in data ? (data as { duration: string }).duration : "N/A" },
      ]}
      description={data.synopsis ?? "No synopsis available."}
      entriesHeading="Episodes Library"
      entriesCountLabel={`${entries.length} Total Units`}
      entries={entries}
      entryLinkPrefix=""
      backLink={animeHubRoute(source)}
      hubLink={animeHubRoute(source)}
      variantColor="text-primary"
      onRenderEntry={(entry) => (
        <Link
          key={entry.id}
          href={entry.href}
          className="group relative flex items-center justify-between p-4 rounded-2xl bg-muted/5 border border-border/10 hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 text-xs font-black text-foreground/80 group-hover:text-primary transition-colors line-clamp-1 pr-4">
            {entry.label}
          </span>
          <div className="relative z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center border border-white/10 group-hover:border-primary/40 group-hover:text-primary transition-all shrink-0">
            <IconPlayerPlay size={14} className="translate-x-0.5" />
          </div>
        </Link>
      )}
    />
  )
}

export default function AnimeDetailRoute({ source = 1 }: { source?: 1 | 2 }) {
  const slug = parseSlugParam(useRouteParam("slug"))

  if (!slug) {
    notFound()
  }

  const { data, isLoading } = useAnimeDetail(source, slug)

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
