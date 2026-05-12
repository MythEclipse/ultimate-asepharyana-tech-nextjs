"use client"

import { ReactNode } from "react"

import { ContentGrid } from "@/components/layout/content-grid"
import { SectionHeader } from "@/components/shared/section-header"


interface MediaHubSectionProps<T> {
  id: string
  title: string
  icon: React.ElementType
  color: string
  link: string
  items: T[]
  maxItems?: number
  renderItem: (item: T, index: number) => ReactNode
}

export function MediaHubSection<T extends { slug?: string }>({
  id,
  title,
  icon,
  color,
  link,
  items,
  maxItems = 10,
  renderItem,
}: MediaHubSectionProps<T>) {
  return (
    <section id={id}>
      <SectionHeader title={title} icon={icon} color={color} link={link} />
      <ContentGrid variant="media">
        {items.slice(0, maxItems).map((item, index) => (
          <div key={item.slug ?? index}>{renderItem(item, index)}</div>
        ))}
      </ContentGrid>
    </section>
  )
}
