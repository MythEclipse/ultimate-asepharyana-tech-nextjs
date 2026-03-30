"use client"

import { useQuery } from "@tanstack/react-query"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { IconBook, IconDiamond, IconBarbell } from "@tabler/icons-react"
import { SectionHeader } from "./section-header"
import { KomikCard } from "./komik-card"
import { fetchManga, fetchManhwa, fetchManhua, type MangaItem } from "@/lib/api/komik"

export function KomikHubContent() {
  const { data: manga } = useQuery({ queryKey: ["manga"], queryFn: () => fetchManga(1) })
  const { data: manhwa } = useQuery({ queryKey: ["manhwa"], queryFn: () => fetchManhwa(1) })
  const { data: manhua } = useQuery({ queryKey: ["manhua"], queryFn: () => fetchManhua(1) })

  if (!manga || !manhwa || !manhua) return <SkeletonGrid count={12} />

  return (
    <TracingBeam className="px-6">
      <div className="space-y-32 py-10">
        <section id="manga">
          <SectionHeader title="Manga • JP" icon={IconBook} color="bg-orange-600" link="/komik/manga/1" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {manga.data.slice(0, 10).map((item: MangaItem, i: number) => (
              <KomikCard key={item.slug || i} item={item} index={i} />
            ))}
          </div>
        </section>

        <section id="manhwa">
          <SectionHeader title="Manhwa • KR" icon={IconDiamond} color="bg-blue-600" link="/komik/manhwa/1" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {manhwa.data.slice(0, 10).map((item: MangaItem, i: number) => (
              <KomikCard key={item.slug || i} item={item} index={i} />
            ))}
          </div>
        </section>

        <section id="manhua">
          <SectionHeader title="Manhua • CN" icon={IconBarbell} color="bg-emerald-600" link="/komik/manhua/1" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {manhua.data.slice(0, 10).map((item: MangaItem, i: number) => (
              <KomikCard key={item.slug || i} item={item} index={i} />
            ))}
          </div>
        </section>
      </div>
    </TracingBeam>
  )
}
