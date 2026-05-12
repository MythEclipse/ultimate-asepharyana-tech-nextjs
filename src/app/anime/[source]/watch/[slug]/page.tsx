import { notFound } from "next/navigation"

import AnimeWatchRoute from "@/components/anime/anime-watch-route"
import { parseAnimeSourceParam } from "@/lib/utils/routes"

export default async function AnimeSourceWatchPage({ params }: { params: Promise<{ source: string; slug: string }> }) {
  const { source } = await params
  const parsedSource = parseAnimeSourceParam(source)

  if (!parsedSource) {
    notFound()
  }

  return <AnimeWatchRoute source={parsedSource} />
}
