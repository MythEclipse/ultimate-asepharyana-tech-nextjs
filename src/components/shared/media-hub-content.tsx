"use client"

import { ReactNode } from "react"

import { MediaHubSection } from "@/components/shared/media-hub-section"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { TracingBeam } from "@/components/ui/tracing-beam"

export interface SharedHubSection<T extends { slug?: string }> {
  id: string
  title: string
  icon: React.ElementType
  color: string
  link: string
  items: T[]
  maxItems?: number
  renderItem: (item: T, index: number) => ReactNode
}

interface MediaHubContentProps<T extends { slug?: string }> {
  sections: SharedHubSection<T>[]
  isLoading?: boolean
  noDataMessage?: ReactNode
}

export function MediaHubContent<T extends { slug?: string }>({ sections, isLoading, noDataMessage }: MediaHubContentProps<T>) {
  if (isLoading) return <SkeletonGrid count={12} />

  const hasAnyItems = sections.some((section) => section.items && section.items.length > 0)

  if (!hasAnyItems) {
    return (
      <div className="px-6 py-20">
        {noDataMessage ?? <div className="text-center text-muted-foreground">No content available</div>}
      </div>
    )
  }

  return (
    <TracingBeam className="px-6">
      <div className="space-y-32 py-10">
        {sections.map((section) => (
          <MediaHubSection
            key={section.id}
            id={section.id}
            title={section.title}
            icon={section.icon}
            color={section.color}
            link={section.link}
            items={section.items}
            maxItems={section.maxItems}
            renderItem={section.renderItem}
          />
        ))}
      </div>
    </TracingBeam>
  )
}
