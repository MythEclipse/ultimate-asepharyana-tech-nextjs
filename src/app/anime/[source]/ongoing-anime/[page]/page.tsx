import { notFound } from "next/navigation"

import { AnimeListPage } from "@/components/anime/anime-list-page"
import { parsePageParam } from "@/lib/utils/route-params"
import { parseAnimeSourceParam } from "@/lib/utils/routes"

export default async function AnimeSourceOngoingPage({ params }: { params: Promise<{ source: string; page: string }> }) {
  const { source, page } = await params
  const parsedSource = parseAnimeSourceParam(source)

  if (!parsedSource) {
    notFound()
  }

  return <AnimeListPage source={parsedSource} page={parsePageParam(page)} type="ongoing" />
}
