import { IconMoodSad, IconSearch } from "@tabler/icons-react"

import { Button } from "./button"

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  variant?: "search" | "error" | "blank"
}

export function EmptyState({
  title = "No items found",
  description = "Data tidak tersedia untuk kueri saat ini.",
  actionLabel = "Refresh",
  onAction,
  variant = "blank",
}: EmptyStateProps) {
  const Icon = variant === "search" ? IconSearch : IconMoodSad

  return (
    <div className="glass border border-border/20 rounded-3xl p-10 text-center mx-auto max-w-xl">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/20 text-secondary">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="mt-6 text-2xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      {onAction ? (
        <div className="mt-6">
          <Button onClick={onAction} variant="secondary" size="lg">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
