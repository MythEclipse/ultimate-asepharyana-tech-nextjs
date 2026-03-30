"use client"

import { TracingBeam } from "@/components/ui/tracing-beam"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { IconFlame, IconChecklist } from "@tabler/icons-react"
import { AnimeCard, type AnimeItem } from "./anime-card"
import { type AnimeSource } from "@/lib/api/anime"
import { getAnimePrefix, useAnimeHubData } from "./use-anime"
import { MediaHubSection } from "@/components/shared/media-hub-section"

export function AnimeHubContent({ source }: { source: AnimeSource }) {
  const { ongoingQuery, completeQuery } = useAnimeHubData(source)

  const ongoing = ongoingQuery.data
  const complete = completeQuery.data
  const prefix = getAnimePrefix(source)

  if (!ongoing || !complete) return <SkeletonGrid count={12} />

  return (
    <TracingBeam className="px-6">
      <div className="space-y-32 py-10">
        <MediaHubSection<AnimeItem>
          id="ongoing"
          title="Hot Ongoing"
          icon={IconFlame}
          color="bg-orange-600"
          link={`/${prefix}/ongoing-anime/1`}
          items={ongoing.data}
          maxItems={10}
          renderItem={(item) => <AnimeCard key={item.slug} item={item} prefix={prefix} />}
        />

        <MediaHubSection<AnimeItem>
          id="complete"
          title="Legendary Completed"
          icon={IconChecklist}
          color="bg-blue-600"
          link={`/${prefix}/complete-anime/1`}
          items={complete.data}
          maxItems={10}
          renderItem={(item) => <AnimeCard key={item.slug} item={item} prefix={prefix} />}
        />
      </div>
    </TracingBeam>
  )
}
