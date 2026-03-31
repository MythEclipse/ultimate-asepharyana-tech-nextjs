"use client"

import { IconFlame, IconChecklist } from "@tabler/icons-react"
import { AnimeCard, type AnimeItem } from "./anime-card"
import { type AnimeSource } from "@/lib/api/anime"
import { getAnimePrefix, useAnimeHubData } from "./use-anime"
import { MediaHubContent, type SharedHubSection } from "@/components/shared/media-hub-content"

export function AnimeHubContent({ source }: { source: AnimeSource }) {
  const { ongoingQuery, completeQuery } = useAnimeHubData(source)

  const ongoing = ongoingQuery.data
  const complete = completeQuery.data
  const prefix = getAnimePrefix(source)

  const sections: SharedHubSection<AnimeItem>[] = [
    {
      id: "ongoing",
      title: "Hot Ongoing",
      icon: IconFlame,
      color: "bg-orange-600",
      link: `/${prefix}/ongoing-anime/1`,
      items: ongoing?.data ?? [],
      maxItems: 10,
      renderItem: (item) => <AnimeCard key={item.slug} item={item} prefix={prefix} />,
    },
    {
      id: "complete",
      title: "Legendary Completed",
      icon: IconChecklist,
      color: "bg-blue-600",
      link: `/${prefix}/complete-anime/1`,
      items: complete?.data ?? [],
      maxItems: 10,
      renderItem: (item) => <AnimeCard key={item.slug} item={item} prefix={prefix} />,
    },
  ]

  return <MediaHubContent sections={sections} isLoading={!ongoing || !complete} />
}
