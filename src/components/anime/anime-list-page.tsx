"use client"

import { MediaListPage } from "@/components/shared/media-list-page"
import { type AnimeSource } from "@/lib/api/anime"
import { animeHubRoute, animeListBaseRoute } from "@/lib/utils/routes"

import { AnimeCard, type AnimeItem } from "./anime-card"
import { useAnimeListData, type AnimeListType } from "./use-anime"


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
      ? "List of currently airing anime."
      : "List of completed anime.",
    accentTextClass: "text-primary",
    tagClass: "bg-primary/10 border border-primary/20 text-primary",
    introText: isOngoing ? "Ongoing" : "Completed",
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
