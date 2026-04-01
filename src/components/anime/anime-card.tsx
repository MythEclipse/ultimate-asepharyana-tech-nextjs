"use client"

import { MediaCard } from "@/components/shared/media-card"
import { type AnimeSource } from "@/lib/api/anime"
import { animeDetailRoute } from "@/lib/utils/routes"

export interface AnimeItem {
  title: string;
  slug: string;
  poster: string;
  episode?: string;
  current_episode?: string;
  episode_count?: string;
  score?: string;
  type?: string;
}

interface AnimeCardProps {
  item: AnimeItem
  source: AnimeSource
  isFirst?: boolean
}

export function AnimeCard({ item, source, isFirst }: AnimeCardProps) {
  const displayEpisode = item.current_episode || item.episode || (item.episode_count ? `${item.episode_count} Eps` : "")

  return (
    <MediaCard
      href={animeDetailRoute(source, item.slug)}
      title={item.title}
      image={item.poster}
      subtitle={item.type}
      score={item.score}
      indicator={displayEpisode}
      typeLabel={item.type || "Anime"}
      variant="primary"
      isFirst={isFirst}
    />
  )
}
