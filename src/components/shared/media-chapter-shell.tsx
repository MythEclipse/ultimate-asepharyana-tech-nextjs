"use client"

import Link from "next/link"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { CachedImage } from "@/components/ui/cached-image"

interface MediaChapterShellProps {
  title: string
  backHref: string
  prevHref?: string
  nextHref?: string
  chapterImageUrls: string[]
  onRenderNavigation?: React.ReactNode
}

export function MediaChapterShell({
  title,
  backHref,
  prevHref,
  nextHref,
  chapterImageUrls,
  onRenderNavigation,
}: MediaChapterShellProps) {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-500">
      <nav className="sticky top-0 z-[100] w-full backdrop-blur-md bg-background/80 border-b border-border/10 py-4 px-4 md:px-8 flex items-center justify-between transition-colors">
        <Link
          href={backHref}
          className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors"
        >
          <span className="text-primary">←</span>
          <span>Back</span>
        </Link>

        <h1 className="text-center font-black text-sm md:text-base italic truncate max-w-[50%] text-muted-foreground/80">
          {title}
        </h1>

        <div className="flex items-center gap-2">
          {prevHref ? (
            <Button href={prevHref} variant="secondary" className="p-2 md:px-6 md:py-2 rounded-xl text-[10px] md:text-xs">
              <span className="sm:hidden">Prev</span>
              <span className="hidden sm:inline">Previous</span>
            </Button>
          ) : (
            <button disabled className="px-4 py-2 bg-muted/20 text-muted-foreground/30 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs cursor-not-allowed">
              Prev
            </button>
          )}

          {nextHref ? (
            <Button href={nextHref} className="p-2 md:px-6 md:py-2 rounded-xl text-[10px] md:text-xs">
              Next
            </Button>
          ) : (
            <button disabled className="px-4 py-2 bg-muted/20 text-muted-foreground/30 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs cursor-not-allowed">
              Next
            </button>
          )}
        </div>
      </nav>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center bg-card/10 min-h-screen shadow-2xl transition-colors">
        {chapterImageUrls.map((src, idx) => (
          <CachedImage
            key={idx}
            src={src}
            alt={`${title} page ${idx + 1}`}
            loading="lazy"
            className="w-full h-auto block select-none px-0"
            retryEnabled
          />
        ))}

        <div className="w-full py-24 flex flex-col items-center justify-center gap-8 border-t border-border/10 mt-10">
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
          <Heading as="h3" className="text-2xl text-muted-foreground/50">
            End of Chapter
          </Heading>
          <div className="flex gap-4">
            <Button href={backHref} variant="secondary" className="px-8 py-4 rounded-full">
              Index
            </Button>
            {nextHref && (
              <Button href={nextHref} className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent shadow-primary/20">
                Next Chapter
              </Button>
            )}
          </div>
        </div>
      </div>
      {onRenderNavigation}
    </main>
  )
}
