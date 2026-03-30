"use client"

import { type AnimeSource } from "@/lib/api/anime"
import { MediaListPage } from "@/components/shared/media-list-page"
import { AnimeCard, type AnimeItem } from "./anime-card"
import { getAnimePrefix, useAnimeListData, type AnimeListType } from "./use-anime"

interface AnimeListPageProps {
  source: AnimeSource
  page: number
  type: AnimeListType
}

export function AnimeListPage({ source, page, type }: AnimeListPageProps) {
  const { data, isLoading, error } = useAnimeListData(source, page, type)
  const isOngoing = type === "ongoing"
  const prefix = getAnimePrefix(source)

  const hero = {
    title: isOngoing ? "ONGOING" : "COMPLETE",
    accent: isOngoing ? "ANIME" : "COLLECTION",
    description: isOngoing
      ? "Monitoring the latest neural transmissions of active series worldwide."
      : "Accessing the complete neural records of legendary concluded series.",
    accentTextClass: "text-primary",
    tagClass: "bg-primary/10 border border-primary/20 text-primary",
    introText: isOngoing ? "Live Uploads" : "Archived Classics",
    colorClass: "border-primary/20",
    linkTextClass: "text-primary",
  }

  return (
    <MediaListPage
      isLoading={isLoading}
      data={data}
      error={error}
      queryName={`${hero.title} ${hero.accent}`}
      itemRenderer={(item) => <AnimeCard item={item as AnimeItem} prefix={prefix} />}
      variant="primary"
      baseUrl={`/${prefix}/${type}-anime`}
      hubLink={`/${prefix}`}
      hero={hero}
    />
  )
}
