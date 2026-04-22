"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchKomikDetail, type KomikDetailData } from "@/lib/api/komik"
import { parseSlugParam, useRouteParam } from "@/lib/utils/route-params"
import { komikChapterRoute, komikHubRoute } from "@/lib/utils/routes"
import { usePageLoadingOverlay } from "@/components/providers/loading-provider"

import { 
  IconCalendar, 
  IconUsers, 
  IconBook,
  IconClock,
  IconPlayerPlay
} from "@tabler/icons-react"
import { MediaDetailShell, type MediaDetailEntry } from "@/components/shared/media-detail-shell"


function KomikDetailContentBody({ data }: { data: KomikDetailData }) {
  const entries: MediaDetailEntry[] = (data.chapters ?? []).map((chapter) => ({
    id: chapter.chapter_id,
    label: chapter.chapter,
    href: komikChapterRoute(chapter.chapter_id),
  }))

  return (
    <MediaDetailShell
      backgroundImage={data.poster}
      posterUrl={data.poster}
      title={data.title}
      genres={data.genres ?? []}
      metaItems={[
        { icon: IconUsers, label: "Status", value: data.status },
        { icon: IconBook, label: "Type", value: data.type },
        { icon: IconCalendar, label: "Author", value: data.author },
        { icon: IconClock, label: "Updated", value: data.updated_on },
      ]}
      description={data.description ?? "No description available."}
      entriesHeading="Chapter List"
      entriesCountLabel={`${entries.length} Chapters`}
      entries={entries}
      entryLinkPrefix=""
      backLink={komikHubRoute()}
      hubLink={komikHubRoute()}
      variantColor="text-orange-500"
      onRenderEntry={(entry) => (
        <Link
          key={entry.id}
          href={entry.href}
          className="group relative flex items-center justify-between p-4 rounded-xl bg-muted/5 border border-border/10 hover:border-orange-500/40 transition-all hover:bg-orange-500/5 overflow-hidden"
        >
          <span className="relative z-10 text-xs font-black text-muted-foreground group-hover:text-orange-500 transition-colors truncate pr-4">
            {entry.label}
          </span>
          <div className="relative z-10 w-8 h-8 rounded-lg bg-background/40 flex items-center justify-center border border-border/20 group-hover:border-orange-500/40 group-hover:text-orange-500 transition-all shrink-0">
            <IconPlayerPlay size={12} className="translate-x-0.5" />
          </div>
        </Link>
      )}
    />
  )
}

export default function KomikDetailRoute() {
  const normalizedSlug = parseSlugParam(useRouteParam("slug"))

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

  usePageLoadingOverlay({ isLoading, label: "ANALYZING ARCHIVES" })

  if (isLoading) {
    return null
  }

  if (!data) notFound()

  return <KomikDetailContentBody data={data} />
}
