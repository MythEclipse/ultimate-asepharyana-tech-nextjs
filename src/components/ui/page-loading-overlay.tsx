"use client"

export function PageLoadingOverlay({
  label = "LOADING",
  show = true,
}: {
  label?: string
  show?: boolean
}) {
  if (!show) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/80 text-foreground backdrop-blur-sm transition-colors duration-200 px-4">
      <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-border/10 bg-card/95 p-8 shadow-2xl shadow-black/10 backdrop-blur-md transition-colors duration-200">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-border/40">
            <div className="absolute inset-0 rounded-full border-[10px] border-primary/20 border-t-primary/60 border-r-transparent border-b-transparent border-l-transparent animate-[spin_1.4s_linear_infinite]" />
            <div className="absolute inset-0 animate-[spin_1.6s_linear_infinite]">
              <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_24px_rgba(59,130,246,0.2)]" />
            </div>
          </div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/85">
          {label}
        </p>
        <p className="max-w-xs text-center text-sm leading-6 text-muted-foreground">
          Hang tight while we assemble the page.
        </p>
      </div>
    </div>
  )
}

export function ContentSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded-full animate-pulse bg-slate-700/70 mb-3"
          style={{ width: `${90 - i * 15}%` }}
        />
      ))}
    </div>
  )
}
