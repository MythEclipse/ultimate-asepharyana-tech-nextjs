"use client"

import { MangaItem } from "@/lib/api/komik"
import { MediaCard } from "@/components/shared/media-card"

interface KomikCardProps {
  item: MangaItem
  index: number
  variant?: "manga" | "manhwa" | "manhua"
}

export function KomikCard({ item, index, variant = "manga" }: KomikCardProps) {
  return (
    <MediaCard
      href={`/komik/detail/${item.slug}`}
      title={item.title}
      image={item.poster}
      subtitle={item.chapter}
      score={item.score}
      typeLabel={item.type || (variant === "manga" ? "Manga" : variant === "manhwa" ? "Manhwa" : "Manhua")}
      variant={variant}
      indicator={item.chapter}
      isFirst={index === 0}
    />
  )
}
