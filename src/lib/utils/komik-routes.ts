import type { HeroConfig } from "@/components/shared/media-list-page"
import { fetchManga, fetchManhua, fetchManhwa, type MangaResponse } from "@/lib/api/komik"

import { komikListBaseRoute, komikListRoute as sharedKomikListRoute } from "./routes"

export type KomikCategory = "manga" | "manhwa" | "manhua"

export function komikListRoute(category: KomikCategory, page: number): string {
  return sharedKomikListRoute(category, page)
}

const MANGA_HERO: HeroConfig = {
  title: "MANGA",
  accent: " Comics",
  description: "Koleksi manga berkualitas tinggi dalam layar jernih pilihan redaksi.",
  accentTextClass: "text-primary",
  tagClass: "bg-primary/10 text-primary border-primary/20",
  introText: "JAPAN COMICS",
  colorClass: "border-primary/30",
  linkTextClass: "text-primary/60",
}

const MANHWA_HERO: HeroConfig = {
  title: "MANHWA",
  accent: " Comics",
  description: "Manhwa Korea dengan visual menawan dan cerita menarik.",
  accentTextClass: "text-indigo-500",
  tagClass: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  introText: "KOREA COMICS",
  colorClass: "border-indigo-500/30",
  linkTextClass: "text-indigo-500/60",
}

const MANHUA_HERO: HeroConfig = {
  title: "MANHUA",
  accent: " Comics",
  description: "Komik Tiongkok dengan cerita fantastis dan aksi menegangkan.",
  accentTextClass: "text-red-500",
  tagClass: "bg-red-500/10 text-red-500 border-red-500/20",
  introText: "CHINA COMICS",
  colorClass: "border-red-500/30",
  linkTextClass: "text-red-500/60",
}

const KATEGORI_CONFIG: Record<
  KomikCategory,
  {
    fetchFn: (page: number) => Promise<MangaResponse>
    queryKeyBase: string
    baseUrl: string
    hero: HeroConfig
  }
> = {
  manga: {
    fetchFn: fetchManga,
    queryKeyBase: "manga-list",
    baseUrl: komikListBaseRoute("manga"),
    hero: MANGA_HERO,
  },
  manhwa: {
    fetchFn: fetchManhwa,
    queryKeyBase: "manhwa-list",
    baseUrl: komikListBaseRoute("manhwa"),
    hero: MANHWA_HERO,
  },
  manhua: {
    fetchFn: fetchManhua,
    queryKeyBase: "manhua-list",
    baseUrl: komikListBaseRoute("manhua"),
    hero: MANHUA_HERO,
  },
}

export function parseKomikCategoryParam(param: string | undefined): KomikCategory | null {
  if (param === "manga" || param === "manhwa" || param === "manhua") {
    return param
  }
  return null
}

export function getKomikCategoryConfig(category: KomikCategory) {
  return KATEGORI_CONFIG[category]
}
