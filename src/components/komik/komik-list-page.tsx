"use client"

import { type MangaResponse } from "@/lib/api/komik"
import { MediaListPage } from "@/components/shared/media-list-page"
import { KomikCard } from "./komik-card"
import { useMediaListData } from "@/components/shared/use-media"

interface KomikListPageProps {
  page: number
  fetchFn: (page: number) => Promise<MangaResponse>
  queryKeyBase: string
  baseUrl: string
  variant: "manga" | "manhwa" | "manhua"
  heroExpose: {
    title: string
    accent: string
    description: string
    accentTextClass: string
    tagClass: string
    introText: string
    colorClass: string
    linkTextClass: string
  }
}

export function KomikListPage({ page, fetchFn, queryKeyBase, baseUrl, variant, heroExpose }: KomikListPageProps) {
  const { data, isLoading, error } = useMediaListData(queryKeyBase ? [queryKeyBase, page] : [page], () => fetchFn(page))

  return (
    <MediaListPage
      isLoading={isLoading}
      data={data}
      error={error}
      queryName={heroExpose.title}
      itemRenderer={(item: import("@/lib/api/komik").MangaItem, index) => (
        <KomikCard key={item.slug || index} item={item} index={index} variant={variant} />
      )}
      variant={variant === "manga" ? "primary" : variant === "manhwa" ? "indigo" : "red"}
      baseUrl={baseUrl}
      hubLink="/komik"
      hero={heroExpose}
    />
  )
}
