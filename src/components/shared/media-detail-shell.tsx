"use client"

import Link from "next/link"
import { ReactNode } from "react"

import { DetailInfo } from "@/components/shared/detail-info"
import { Badge } from "@/components/ui/badge"
import { CachedImage } from "@/components/ui/cached-image"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { TracingBeam } from "@/components/ui/tracing-beam"

export interface MediaDetailMetaItem {
  icon: React.ElementType
  label: string
  value?: string
  iconBgClass?: string
}

export interface MediaDetailEntry {
  id: string
  label: string
  href: string
}

interface MediaDetailShellProps {
  backgroundImage: string
  posterUrl: string
  title: string
  subtitle?: string
  genres?: string[]
  metaItems: MediaDetailMetaItem[]
  description: string
  entriesHeading: string
  entriesCountLabel: string
  entries: MediaDetailEntry[]
  entryLinkPrefix: string
  backLink?: string
  hubLink?: string
  variantColor?: string
  onRenderEntry?: (entry: MediaDetailEntry, idx: number) => ReactNode
}

export function MediaDetailShell({
  backgroundImage,
  posterUrl,
  title,
  subtitle,
  genres = [],
  metaItems,
  description,
  entriesHeading,
  entriesCountLabel,
  entries,
  entryLinkPrefix,
  backLink,
  hubLink,
  variantColor = "text-primary",
  onRenderEntry,
}: MediaDetailShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground pb-32 transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-[70vh] pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-3xl opacity-20 scale-110"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <Section className="relative z-10 pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8">
        <TracingBeam className="px-4 sm:px-6 md:px-0">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="w-full lg:w-1/3 xl:w-80 shrink-0 flex flex-col gap-8">
              <Card className="relative p-0 overflow-hidden aspect-[3/4.2] border-white/10 group shadow-2xl transition-transform duration-500">
                <CachedImage
                  src={posterUrl}
                  alt={title}
                  fill
                  eager
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </Card>

              <Card className="p-6 bg-card border-border/50">
                {metaItems.map((item, index) => (
                  <DetailInfo
                    key={`${item.label}-${index}`}
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                    iconBgClass={item.iconBgClass}
                  />
                ))}
              </Card>
            </div>

            <div className="flex-1 max-w-4xl pt-4">
              <header className="space-y-6 mb-12">
                <div className="flex items-center gap-4">
                  {backLink && (
                    <Link href={backLink} className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 hover:text-foreground">
                      ← Back
                    </Link>
                  )}
                  {hubLink && (
                    <Link href={hubLink} className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 hover:text-foreground">
                      Hub
                    </Link>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none italic text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground/80 to-muted-foreground/50">
                  {title}
                </h1>
                {subtitle && (
                  <h2 className="text-xl md:text-2xl text-muted-foreground/60 font-medium italic tracking-tight">
                    {subtitle}
                  </h2>
                )}
                <div className="flex flex-wrap gap-2 pt-4">
                  {genres.map((genre) => (
                    <Badge key={genre} variant="glass" className="px-4 py-1.5 text-[10px] uppercase font-black">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </header>

              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                    <div className={`w-6 h-1 ${variantColor.replace("text-", "bg-") || "bg-primary"} rounded-full`} />
                    Synopsis
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">{description}</p>
                </div>

                <div className="pt-12 border-t border-border/10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl md:text-3xl font-black text-foreground">{entriesHeading}</h3>
                    <Badge variant="outline" className="uppercase text-[10px]">
                      {entriesCountLabel}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {entries.map((entry, index) =>
                      onRenderEntry ? (
                        <div key={entry.id}>{onRenderEntry(entry, index)}</div>
                      ) : (
                        <Link
                          key={entry.id}
                          href={`${entryLinkPrefix}${entry.href}`}
                          className="group relative flex items-center justify-between p-4 rounded-2xl bg-muted/5 border border-border/10 hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-95 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="relative z-10 text-xs font-black text-foreground/80 group-hover:text-primary transition-colors line-clamp-1 pr-4">
                            {entry.label}
                          </span>
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TracingBeam>
      </Section>
    </div>
  )
}
