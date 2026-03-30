"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CachedImage } from "@/components/ui/cached-image"
import { IconPlayerPlay } from "@tabler/icons-react"

export interface AnimeItem {
  title: string;
  slug: string;
  poster: string;
  episode?: string;
  current_episode?: string;
  episode_count?: string;
  score?: string;
  type?: string;
}

interface AnimeCardProps {
  item: AnimeItem
  prefix: string
}

export function AnimeCard({ item, prefix }: AnimeCardProps) {
  // Normalize fields for the UI
  const displayEpisode = item.current_episode || item.episode || (item.episode_count ? `${item.episode_count} Eps` : "");

  return (
    <Link href={`/${prefix}/detail/${item.slug}`} className="group relative block h-full">
      <Card className="relative p-0 overflow-hidden aspect-[3/4.2] border-white/5 group-hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
        <CachedImage
          src={item.poster}
          alt={item.title}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {item.score && (
            <Badge variant="glass" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-[10px] font-black">
              ⭐ {item.score}
            </Badge>
          )}
          {item.type && (
            <Badge variant="glass" className="text-[9px] uppercase font-black tracking-widest bg-white/10 backdrop-blur-md">
                {item.type}
            </Badge>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          {displayEpisode && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/20 border border-primary/30 text-[9px] font-black uppercase text-primary">
                {displayEpisode}
            </div>
          )}
          <h3 className="text-sm md:text-base font-bold text-foreground leading-tight line-clamp-2 transition-colors group-hover:text-primary">
            {item.title}
          </h3>
          <div className="pt-2 flex items-center gap-4 text-[10px] text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="flex items-center gap-1"><IconPlayerPlay size={10} /> Watch Now</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
