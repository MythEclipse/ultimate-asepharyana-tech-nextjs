"use client"

import { ReactNode } from "react"
import { MediaSearchResults } from "@/components/shared/media-search-results"

interface MediaSearchPageProps<T> {
  query: string
  isLoading: boolean
  error: unknown
  items: T[]
  count: number
  primaryLabel?: string
  accentLabel?: string
  hrefBack: string
  onRenderCard: (item: T, index: number) => ReactNode
  emptyMessage?: string
  emptyHelpText?: string
  badgeLabel?: string
}

export function MediaSearchPage<T>({
  query,
  isLoading,
  error,
  items,
  count,
  primaryLabel = "Search Results",
  accentLabel = "",
  hrefBack,
  onRenderCard,
  emptyMessage,
  emptyHelpText,
}: MediaSearchPageProps<T>) {
  return (
    <MediaSearchResults
      query={query}
      isLoading={isLoading}
      error={error}
      items={items}
      count={count}
      primaryLabel={primaryLabel}
      accentLabel={accentLabel}
      hrefBack={hrefBack}
      onRenderCard={onRenderCard}
      emptyMessage={emptyMessage}
      emptyHelpText={emptyHelpText}
    />
  )
}
