"use client"

import { Heading } from "@/components/ui/heading"
import { Badge } from "@/components/ui/badge"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconMoodSad } from "@tabler/icons-react"

interface MediaSearchResultsProps<T> {
  query: string
  isLoading: boolean
  error: unknown
  items?: T[]
  count: number
  primaryLabel: string
  accentLabel: string
  hrefBack: string
  onRenderCard: (item: T, index: number) => React.ReactNode
  emptyMessage?: string
  emptyHelpText?: string
}

export function MediaSearchResults<T>({
  query,
  isLoading,
  error,
  items,
  count,
  primaryLabel,
  accentLabel,
  hrefBack,
  onRenderCard,
  emptyMessage = "No matching items found.",
  emptyHelpText = "Please refine your query and try again.",
}: MediaSearchResultsProps<T>) {
  if (isLoading) return <SkeletonGrid count={10} />

  const hasNoData = !items || items.length === 0
  if (error || hasNoData) {
    return (
      <div className="flex flex-col items-center justify-center p-20 glass rounded-[3rem] border border-border/10 animate-fade-in">
        <IconMoodSad size={80} className="text-muted-foreground/20 mb-6" />
        <Heading as="h3" className="text-2xl text-muted-foreground font-black uppercase italic tracking-tighter">
          {emptyMessage}
        </Heading>
        <p className="text-muted-foreground/60 mt-2 max-w-sm text-center font-medium">{emptyHelpText}</p>
        <Button href={hrefBack} className="mt-8 rounded-2xl" variant="outline">
          <IconArrowLeft className="mr-2" /> Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-20">
      <div className="flex flex-col items-center text-center space-y-6 mb-20 animate-fade-in">
        <Badge variant="glass" className="px-6 py-1.5 border-primary/20 text-primary uppercase tracking-[0.3em] font-black">
          Search Results
        </Badge>
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-foreground">
            {primaryLabel} <span className="text-primary">{accentLabel}</span>
          </h1>
          <p className="text-muted-foreground font-medium tracking-widest text-sm uppercase opacity-50">
            Located {count} matching entries for &quot;{query}&quot;
          </p>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((item, idx) => (
          <div key={idx}>{onRenderCard(item, idx)}</div>
        ))}
      </div>
    </div>
  )
}
