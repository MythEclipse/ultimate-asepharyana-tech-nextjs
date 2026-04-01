export type AnimeSource = 1 | 2
export type AnimeListType = "ongoing" | "complete"
export type KomikCategory = "manga" | "manhwa" | "manhua"

export function animePrefix(source: AnimeSource): "anime" | "anime2" {
  return source === 2 ? "anime2" : "anime"
}

export function animeHubRoute(source: AnimeSource): string {
  return `/${animePrefix(source)}`
}

export function animeSearchRoute(source: AnimeSource): string {
  return `${animeHubRoute(source)}/search`
}

export function animeListBaseRoute(source: AnimeSource, type: AnimeListType): string {
  return `${animeHubRoute(source)}/${type}-anime`
}

export function animeListRoute(source: AnimeSource, type: AnimeListType, page: number): string {
  return `${animeListBaseRoute(source, type)}/${page}`
}

export function animeDetailRoute(source: AnimeSource, slug: string): string {
  return `${animeHubRoute(source)}/detail/${encodeURIComponent(slug)}`
}

export function animeWatchRoute(source: AnimeSource, slug: string): string {
  return `${animeHubRoute(source)}/watch/${encodeURIComponent(slug)}`
}

export function komikHubRoute(): string {
  return "/komik"
}

export function komikSearchRoute(): string {
  return `${komikHubRoute()}/search`
}

export function komikListBaseRoute(category: KomikCategory): string {
  return `${komikHubRoute()}/${category}`
}

export function komikListRoute(category: KomikCategory, page: number): string {
  return `${komikListBaseRoute(category)}/${page}`
}

export function komikDetailRoute(slug: string): string {
  return `${komikHubRoute()}/detail/${encodeURIComponent(slug)}`
}

export function komikChapterRoute(slug: string): string {
  return `${komikHubRoute()}/chapter/${encodeURIComponent(slug)}`
}