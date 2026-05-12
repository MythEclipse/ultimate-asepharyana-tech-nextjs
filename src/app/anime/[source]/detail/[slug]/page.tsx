import { notFound } from "next/navigation"

import AnimeDetailRoute from "@/components/anime/anime-detail-route"
import { parseAnimeSourceParam } from "@/lib/utils/routes"

export default async function AnimeSourceDetailPage({ params }: { params: Promise<{ source: string; slug: string }> }) {
  const { source } = await params
  const parsedSource = parseAnimeSourceParam(source)

  if (!parsedSource) {
    notFound()
  }

  return <AnimeDetailRoute source={parsedSource} />
}
