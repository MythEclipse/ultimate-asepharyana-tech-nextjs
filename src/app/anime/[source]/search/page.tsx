import { notFound } from "next/navigation"

import AnimeSearchPage from "@/components/anime/anime-search-route"
import { parseAnimeSourceParam } from "@/lib/utils/routes"

export default async function AnimeSourceSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ source: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { source } = await params
  const parsedSource = parseAnimeSourceParam(source)

  if (!parsedSource) {
    notFound()
  }

  return <AnimeSearchPage searchParams={searchParams} source={parsedSource} />
}
