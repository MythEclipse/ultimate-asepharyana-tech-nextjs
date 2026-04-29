"use client"

import { useQuery } from "@tanstack/react-query"
import { notFound } from "next/navigation"

import { usePageLoadingOverlay } from "@/components/providers/loading-provider"
import { MediaChapterShell } from "@/components/shared/media-chapter-shell"
import { fetchChapter, type ChapterData } from "@/lib/api/komik"
import { parseSlugParam, useRouteParam } from "@/lib/utils/route-params"
import { komikChapterRoute, komikDetailRoute } from "@/lib/utils/routes"

function KomikChapterView({ data }: { data: ChapterData }) {
  let listSlug = data.list_chapter
  if (listSlug.endsWith("/")) listSlug = listSlug.slice(0, -1)
  const parts = listSlug.split("/")
  const komikId = parts[parts.length - 1]

  return (
    <MediaChapterShell
      title={data.title}
      backHref={komikDetailRoute(komikId)}
      prevHref={data.prev_chapter_id ? komikChapterRoute(data.prev_chapter_id) : undefined}
      nextHref={data.next_chapter_id ? komikChapterRoute(data.next_chapter_id) : undefined}
      chapterImageUrls={data.images ?? []}
    />
  )
}

export default function KomikChapterRoute() {
  const slug = parseSlugParam(useRouteParam("slug"))

  if (!slug) {
    notFound()
  }

  const { data, isLoading, error } = useQuery<ChapterData>({
    queryKey: ["komik-chapter", slug],
    queryFn: () => fetchChapter(slug),
    enabled: Boolean(slug),
  })

  if (error) {
    notFound()
  }

  usePageLoadingOverlay({ isLoading, label: "DECODING PAGES" })

  if (isLoading) {
    return null
  }

  if (!data) notFound()

  return <KomikChapterView data={data} />
}
