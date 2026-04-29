"use client"

import { IconBook, IconDiamond, IconBarbell } from "@tabler/icons-react"

import { MediaHubContent, type SharedHubSection } from "@/components/shared/media-hub-content"
import { EmptyState } from "@/components/ui/empty-state"
import { komikListRoute } from "@/lib/utils/routes"

import { KomikCard } from "./komik-card"
import { useKomikHubData } from "./use-komik"

export function KomikHubContent() {
  const { mangaQuery, manhwaQuery, manhuaQuery } = useKomikHubData()

  const manga = mangaQuery.data
  const manhwa = manhwaQuery.data
  const manhua = manhuaQuery.data

  const isLoading = mangaQuery.isLoading || manhwaQuery.isLoading || manhuaQuery.isLoading

  const noDataMessage = (
    <EmptyState
      title="Library sedang kosong"
      description="Saat ini tidak ada konten komik terdaftar. Coba lagi nanti atau periksa pembaruan lainnya."
      variant="blank"
    />
  )

  const sections: SharedHubSection<import("@/lib/api/komik").MangaItem>[] = [
    {
      id: "manga",
      title: "Manga • JP",
      icon: IconBook,
      color: "bg-orange-600",
      link: komikListRoute("manga", 1),
      items: manga?.data ?? [],
      maxItems: 10,
      renderItem: (item, index) => <KomikCard key={item.slug} item={item} index={index} />,
    },
    {
      id: "manhwa",
      title: "Manhwa • KR",
      icon: IconDiamond,
      color: "bg-blue-600",
      link: komikListRoute("manhwa", 1),
      items: manhwa?.data ?? [],
      maxItems: 10,
      renderItem: (item, index) => <KomikCard key={item.slug} item={item} index={index} />,
    },
    {
      id: "manhua",
      title: "Manhua • CN",
      icon: IconBarbell,
      color: "bg-emerald-600",
      link: komikListRoute("manhua", 1),
      items: manhua?.data ?? [],
      maxItems: 10,
      renderItem: (item, index) => <KomikCard key={item.slug} item={item} index={index} />,
    },
  ]

  return <MediaHubContent sections={sections} isLoading={isLoading} noDataMessage={noDataMessage} />
}
