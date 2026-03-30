"use client"

import { useQuery } from "@tanstack/react-query"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { IconBook, IconDiamond, IconBarbell } from "@tabler/icons-react"
import { KomikCard } from "./komik-card"
import { fetchManga, fetchManhwa, fetchManhua } from "@/lib/api/komik"
import { MediaHubSection } from "@/components/shared/media-hub-section"

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

  return (
    <TracingBeam className="px-6">
      <div className="space-y-32 py-10">
        <MediaHubSection<import("@/lib/api/komik").MangaItem>
          id="manga"
          title="Manga • JP"
          icon={IconBook}
          color="bg-orange-600"
          link="/komik/manga/1"
          items={manga.data}
          maxItems={10}
          renderItem={(item, index) => <KomikCard key={item.slug} item={item} index={index} />}
        />

        <MediaHubSection<import("@/lib/api/komik").MangaItem>
          id="manhwa"
          title="Manhwa • KR"
          icon={IconDiamond}
          color="bg-blue-600"
          link="/komik/manhwa/1"
          items={manhwa.data}
          maxItems={10}
          renderItem={(item, index) => <KomikCard key={item.slug} item={item} index={index} />}
        />

        <MediaHubSection<import("@/lib/api/komik").MangaItem>
          id="manhua"
          title="Manhua • CN"
          icon={IconBarbell}
          color="bg-emerald-600"
          link="/komik/manhua/1"
          items={manhua.data}
          maxItems={10}
          renderItem={(item, index) => <KomikCard key={item.slug} item={item} index={index} />}
        />
      </div>
    </TracingBeam>
  )
}
