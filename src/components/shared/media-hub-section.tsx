"use client"

import { ReactNode } from "react"

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
        {items.slice(0, maxItems).map((item, index) => (
          <div key={item.slug ?? index}>{renderItem(item, index)}</div>
        ))}
      </div>
    </section>
  )
}
