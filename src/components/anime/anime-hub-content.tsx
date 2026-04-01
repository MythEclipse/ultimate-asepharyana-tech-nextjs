"use client"

import { IconFlame, IconChecklist } from "@tabler/icons-react"
import { AnimeCard, type AnimeItem } from "./anime-card"
import { type AnimeSource } from "@/lib/api/anime"
import { useAnimeHubData } from "./use-anime"
import { MediaHubContent, type SharedHubSection } from "@/components/shared/media-hub-content"
import { animeListRoute } from "@/lib/utils/routes"

export function AnimeHubContent({ source }: { source: AnimeSource }) {
  const { ongoingQuery, completeQuery } = useAnimeHubData(source)

  const ongoing = ongoingQuery.data
  const complete = completeQuery.data

  const sections: SharedHubSection<AnimeItem>[] = [
    {
      id: "ongoing",
      title: "Hot Ongoing",
      icon: IconFlame,
      color: "bg-orange-600",
      link: animeListRoute(source, "ongoing", 1),
      items: ongoing?.data ?? [],
      maxItems: 10,
      renderItem: (item) => <AnimeCard key={item.slug} item={item} source={source} />,
    },
    {
      id: "complete",
      title: "Legendary Completed",
      icon: IconChecklist,
      color: "bg-blue-600",
      link: animeListRoute(source, "complete", 1),
      items: complete?.data ?? [],
      maxItems: 10,
      renderItem: (item) => <AnimeCard key={item.slug} item={item} source={source} />,
    },
  ]

  return <MediaHubContent sections={sections} isLoading={ongoingQuery.isLoading || completeQuery.isLoading} />
}
