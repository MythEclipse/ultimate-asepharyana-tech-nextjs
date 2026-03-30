"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CachedImage } from "@/components/ui/cached-image"
import { IconPlayerPlay } from "@tabler/icons-react"
import { MangaItem } from "@/lib/api/komik"

interface KomikCardProps {
  item: MangaItem
  index: number
  variant?: "manga" | "manhwa" | "manhua"
}

const variantStyles = {
  manga: {
    border: "group-hover:border-cyan-500/50",
    badgeBg: "bg-cyan-500/20",
    badgeText: "text-cyan-400",
    badgeBorder: "border-cyan-500/30",
    chipBg: "bg-cyan-500/20",
    chipBorder: "border-cyan-500/30",
    chipText: "text-cyan-400",
    titleHover: "group-hover:text-cyan-400",
  },
  manhwa: {
    border: "group-hover:border-indigo-500/50",
    badgeBg: "bg-indigo-500/20",
    badgeText: "text-indigo-400",
    badgeBorder: "border-indigo-500/30",
    chipBg: "bg-indigo-500/20",
    chipBorder: "border-indigo-500/30",
    chipText: "text-indigo-400",
    titleHover: "group-hover:text-indigo-400",
  },
  manhua: {
    border: "group-hover:border-red-500/50",
    badgeBg: "bg-red-500/20",
    badgeText: "text-red-400",
    badgeBorder: "border-red-500/30",
    chipBg: "bg-red-500/20",
    chipBorder: "border-red-500/30",
    chipText: "text-red-400",
    titleHover: "group-hover:text-red-400",
  },
} as const

export function KomikCard({ item, index, variant = "manga" }: KomikCardProps) {
  const styles = variantStyles[variant]

  return (
    <Link href={`/komik/detail/${item.slug}`} className="group relative block h-full animate-slide-up">
      <Card className={`relative p-0 overflow-hidden aspect-[3/4.2] border-white/5 ${styles.border} transition-all duration-500 shadow-2xl bg-card`}>
        <CachedImage
          src={item.poster}
          alt={item.title}
          fill
          loading={index === 0 ? "eager" : "lazy"}
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
           <Badge variant="glass" className={`${styles.badgeBg} ${styles.badgeText} ${styles.badgeBorder} text-[9px] font-black uppercase`}>
             {item.type || (variant === "manga" ? "Manga" : variant === "manhwa" ? "Manhwa" : "Manhua")}
           </Badge>
           {item.score && (
              <Badge variant="glass" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[9px] font-black">
                ⭐ {item.score}
              </Badge>
           )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ${styles.chipBg} ${styles.chipBorder} text-[9px] font-black uppercase ${styles.chipText}`}>
             {item.chapter}
          </div>
          <h3 className={`text-sm md:text-base font-bold text-white leading-tight line-clamp-2 transition-colors ${styles.titleHover}`}>
            {item.title}
          </h3>
          <div className="pt-2 flex items-center gap-4 text-[10px] text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="flex items-center gap-1"><IconPlayerPlay size={10} /> Read Now</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
