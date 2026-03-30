"use client"

import { useQuery } from "@tanstack/react-query"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { IconFlame, IconChecklist } from "@tabler/icons-react"
import { SectionHeader } from "./section-header"
import { AnimeCard } from "./anime-card"
import { fetchAnimeOngoing, fetchAnimeComplete, type AnimeSource } from "@/lib/api/anime"

export function AnimeHubContent({ source }: { source: AnimeSource }) {
  const { data: ongoing } = useQuery({ 
      queryKey: ["ongoing", source], 
      queryFn: () => fetchAnimeOngoing(source, 1) 
  })
  const { data: complete } = useQuery({ 
      queryKey: ["complete", source], 
      queryFn: () => fetchAnimeComplete(source, 1) 
  })

  const prefix = source === 2 ? "anime2" : "anime"

  if (!ongoing || !complete) return <SkeletonGrid count={12} />

  return (
    <TracingBeam className="px-6">
      <div className="space-y-32 py-10">
        <section id="ongoing">
          <SectionHeader title="Hot Ongoing" icon={IconFlame} color="bg-orange-600" link={`/${prefix}/ongoing-anime/1`} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
            {ongoing.data.slice(0, 10).map((item, i: number) => (
              <AnimeCard key={item.slug || i} item={item} prefix={prefix} />
            ))}
          </div>
        </section>

        <section id="complete">
          <SectionHeader title="Legendary Completed" icon={IconChecklist} color="bg-blue-600" link={`/${prefix}/complete-anime/1`} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
            {complete.data.slice(0, 10).map((item, i: number) => (
              <AnimeCard key={item.slug || i} item={item} prefix={prefix} />
            ))}
          </div>
        </section>
      </div>
    </TracingBeam>
  )
}
