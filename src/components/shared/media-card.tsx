"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CachedImage } from "@/components/ui/cached-image"
import { IconPlayerPlay } from "@tabler/icons-react"

export type MediaCardVariant = "primary" | "indigo" | "red" | "manga" | "manhwa" | "manhua"

interface MediaCardProps {
  href: string
  title: string
  image: string
  subtitle?: string
  score?: string
  typeLabel?: string
  badge?: string
  indicator?: string
  variant?: MediaCardVariant
  isFirst?: boolean
}

const variantStyleMap: Record<MediaCardVariant, { border: string; chip: string; hoverText: string }> = {
  primary: { border: "group-hover:border-primary/50", chip: "bg-primary/20 border-primary/30 text-primary", hoverText: "group-hover:text-primary" },
  indigo: { border: "group-hover:border-indigo-500/50", chip: "bg-indigo-500/20 border-indigo-500/30 text-indigo-400", hoverText: "group-hover:text-indigo-400" },
  red: { border: "group-hover:border-red-500/50", chip: "bg-red-500/20 border-red-500/30 text-red-400", hoverText: "group-hover:text-red-400" },
  manga: { border: "group-hover:border-cyan-500/50", chip: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400", hoverText: "group-hover:text-cyan-400" },
  manhwa: { border: "group-hover:border-indigo-500/50", chip: "bg-indigo-500/20 border-indigo-500/30 text-indigo-400", hoverText: "group-hover:text-indigo-400" },
  manhua: { border: "group-hover:border-red-500/50", chip: "bg-red-500/20 border-red-500/30 text-red-400", hoverText: "group-hover:text-red-400" },
}

export function MediaCard({
  href,
  title,
  image,
  subtitle,
  score,
  typeLabel,
  badge,
  indicator,
  variant = "primary",
  isFirst = false,
}: MediaCardProps) {
  const styles = variantStyleMap[variant]

  return (
    <Link href={href} className="group relative block h-full animate-slide-up">
      <Card className={`relative p-0 overflow-hidden aspect-[3/4.2] border-white/5 ${styles.border} transition-all duration-500 shadow-2xl bg-card`}>
        <CachedImage
          src={image}
          alt={title}
          fill
          loading={isFirst ? "eager" : "lazy"}
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {(score || typeLabel) && (
            <div className="flex items-center gap-1">
              {score && (
                <Badge variant="glass" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[9px] font-black">
                  ⭐ {score}
                </Badge>
              )}
              <Badge variant="glass" className="text-[9px] uppercase font-black tracking-widest bg-white/10 backdrop-blur-md">
                {typeLabel || badge || "Media"}
              </Badge>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          {indicator && (
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ${styles.chip} text-[9px] font-black uppercase`}>
              {indicator}
            </div>
          )}
          <h3 className={`text-sm md:text-base font-bold text-white leading-tight line-clamp-2 transition-colors ${styles.hoverText}`}>
            {title}
          </h3>
          <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>
          <div className="pt-2 flex items-center gap-4 text-[10px] text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="flex items-center gap-1"><IconPlayerPlay size={10} />{variant === "manga" || variant === "manhwa" || variant === "manhua" ? " Read" : " Watch"}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
