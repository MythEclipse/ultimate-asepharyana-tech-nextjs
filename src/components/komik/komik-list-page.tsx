"use client"

import { MediaListPage, type HeroConfig } from "@/components/shared/media-list-page"
import { useMediaListData } from "@/components/shared/use-media"
import { type MangaResponse } from "@/lib/api/komik"
import { komikHubRoute } from "@/lib/utils/routes"

import { KomikCard } from "./komik-card"

interface KomikListPageProps {
  page: number
  fetchFn: (page: number) => Promise<MangaResponse>
  queryKeyBase: string
  baseUrl: string
  variant: "manga" | "manhwa" | "manhua"
  heroExpose: HeroConfig
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
      hubLink={komikHubRoute()}
      hero={heroExpose}
    />
  )
}
