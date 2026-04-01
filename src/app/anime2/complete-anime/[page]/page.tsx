"use client"

import { AnimeListPage } from "@/components/anime/anime-list-page"
import { parsePageParam, useRouteParam } from "@/lib/utils/route-params"

export default function Page() {
  const page = parsePageParam(useRouteParam("page"))

  return <AnimeListPage source={2} page={page} type="complete" />
}
