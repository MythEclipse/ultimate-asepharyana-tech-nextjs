"use client"

import { type AnimeSource } from "@/lib/api/anime"
import { MediaListPage } from "@/components/shared/media-list-page"
import { AnimeCard, type AnimeItem } from "./anime-card"
import { useAnimeListData, type AnimeListType } from "./use-anime"
import { animeHubRoute, animeListBaseRoute } from "@/lib/utils/routes"

interface AnimeListPageProps {
  source: AnimeSource
  page: number
  type: AnimeListType
}

export function AnimeListPage({ source, page, type }: AnimeListPageProps) {
  const { data, isLoading, error } = useAnimeListData(source, page, type)
  const isOngoing = type === "ongoing"

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
      itemRenderer={(item) => <AnimeCard item={item as AnimeItem} source={source} />}
      variant="primary"
      baseUrl={animeListBaseRoute(source, type)}
      hubLink={animeHubRoute(source)}
      hero={hero}
    />
  )
}
