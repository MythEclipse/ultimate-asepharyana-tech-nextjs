import { notFound } from "next/navigation"

import { AnimePageShell } from "@/components/anime/anime-page-shell"
import { parseAnimeSourceParam } from "@/lib/utils/routes"

export default async function AnimeSourcePage({ params }: { params: Promise<{ source: string }> }) {
  const { source } = await params
  const parsedSource = parseAnimeSourceParam(source)

  if (!parsedSource) {
    notFound()
  }

  return <AnimePageShell source={parsedSource} />
}
