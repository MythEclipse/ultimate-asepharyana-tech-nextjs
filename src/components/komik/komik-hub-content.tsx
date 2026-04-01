"use client"

import { useQuery } from "@tanstack/react-query"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { IconBook, IconDiamond, IconBarbell } from "@tabler/icons-react"
import { KomikCard } from "./komik-card"
import { fetchManga, fetchManhwa, fetchManhua } from "@/lib/api/komik"
import { MediaHubContent, type SharedHubSection } from "@/components/shared/media-hub-content"
import { komikListRoute } from "@/lib/utils/routes"

export function KomikHubContent() {
  const { data: manga } = useQuery({ queryKey: ["manga"], queryFn: () => fetchManga(1) })
  const { data: manhwa } = useQuery({ queryKey: ["manhwa"], queryFn: () => fetchManhwa(1) })
  const { data: manhua } = useQuery({ queryKey: ["manhua"], queryFn: () => fetchManhua(1) })

  if (!manga || !manhwa || !manhua) return <SkeletonGrid count={12} />

  if (manga.data.length === 0 && manhwa.data.length === 0 && manhua.data.length === 0) {
    return (
      <div className="px-6 py-20">
        <EmptyState
          title="Library sedang kosong"
          description="Saat ini tidak ada konten komik terdaftar. Coba lagi nanti atau periksa pembaruan lainnya."
          variant="blank"
        />
      </div>
    )
  }

  const sections: SharedHubSection<import("@/lib/api/komik").MangaItem>[] = [
    {
      id: "manga",
      title: "Manga • JP",
      icon: IconBook,
      color: "bg-orange-600",
      link: komikListRoute("manga", 1),
      items: manga.data,
      maxItems: 10,
      renderItem: (item, index) => <KomikCard key={item.slug} item={item} index={index} />,
    },
    {
      id: "manhwa",
      title: "Manhwa • KR",
      icon: IconDiamond,
      color: "bg-blue-600",
      link: komikListRoute("manhwa", 1),
      items: manhwa.data,
      maxItems: 10,
      renderItem: (item, index) => <KomikCard key={item.slug} item={item} index={index} />,
    },
    {
      id: "manhua",
      title: "Manhua • CN",
      icon: IconBarbell,
      color: "bg-emerald-600",
      link: komikListRoute("manhua", 1),
      items: manhua.data,
      maxItems: 10,
      renderItem: (item, index) => <KomikCard key={item.slug} item={item} index={index} />,
    },
  ]

  return <MediaHubContent sections={sections} />
}
