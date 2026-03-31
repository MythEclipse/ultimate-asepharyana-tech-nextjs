import { fetchApi } from "./config"
import { ApiResponse, Pagination } from "./types"
import type {
  AnimeDetailData,
  AnimeFullData,
  SearchAnimeItem,
} from "./anime"
import type {
  MangaResponse,
  KomikDetailData,
} from "./komik"

const REVALIDATE_TIME = 3600

type AnimeSource = "anime1" | "anime2"
export type MediaSource = AnimeSource | "komik"

interface MediaDownloadGroup {
  resolution?: string
  links?: { name: string; url: string }[]
}


function getMediaPrefix(source: MediaSource): string {
  switch (source) {
    case "anime1":
      return "/anime"
    case "anime2":
      return "/anime2"
    case "komik":
      return "/komik"
  }
}

export async function fetchMediaList<T>(
  source: MediaSource,
  category: "ongoing" | "complete" | "manga" | "manhwa" | "manhua",
  page: number,
): Promise<{ data: T[]; pagination: Pagination }> {
  if (source === "komik") {
    const endpoint = `${getMediaPrefix(source)}/${category}/${page}`
    return fetchApi<MangaResponse>(endpoint, { next: { revalidate: REVALIDATE_TIME } }) as Promise<{ data: T[]; pagination: Pagination }>
  }

  const endpoint = `${getMediaPrefix(source)}/${category === "ongoing" ? "ongoing_anime" : "complete_anime"}/${page}`
  const response = await fetchApi<ApiResponse<T[]>>(endpoint, { next: { revalidate: REVALIDATE_TIME } })

  const data = response.data ?? []
  const pagination = response.pagination ?? (response.meta as { pagination?: Pagination })?.pagination
  if (!pagination) throw new Error("Missing pagination")

  return { data, pagination }
}

export async function fetchMediaDetail(source: MediaSource, slug: string): Promise<AnimeDetailData | KomikDetailData> {
  if (source === "komik") {
    const res = await fetchApi<ApiResponse<KomikDetailData>>(`${getMediaPrefix(source)}/detail/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE_TIME / 2 },
    })
    if (!res.data) throw new Error("No data found")
    return res.data
  }

  const res = await fetchApi<ApiResponse<AnimeDetailData>>(`${getMediaPrefix(source)}/detail/${encodeURIComponent(slug)}`, {
    next: { revalidate: REVALIDATE_TIME / 2 },
  })

  if (!res.data) throw new Error("No data found")

  return res.data
}


export async function fetchMediaStream(source: AnimeSource, slug: string): Promise<AnimeFullData> {
  if (source === "anime1") {
    const res = await fetchApi<ApiResponse<AnimeFullData>>(`/anime/full/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE_TIME },
    })
    if (!res.data) throw new Error("No data found")
    return res.data
  }

  // anime2: reuse existing behavior by building via detail
  const detail = await fetchMediaDetail("anime2", slug) as AnimeDetailData

  const match = slug.match(/^(.*)-episode-(.*)$/)
  if (!match) throw new Error("Invalid slug format for Anime2")
  const animeSlug = match[1]
  const epNum = match[2]

  const download_urls: Record<string, { server: string; url: string }[]> = {}
  const groups = [...(detail.downloads ?? []), ...((detail as unknown as { batch?: MediaDownloadGroup[] }).batch ?? [])]

  for (const group of groups) {
    const resStr = group.resolution || ""
    const resClean = resStr.replace(/Episode/i, "").trim()
    const matchFound = parseInt(resClean) === parseInt(epNum) || resClean === epNum
    if (matchFound && group.links) {
      download_urls[resStr] = group.links.map((l) => ({ server: l.name, url: l.url }))
    }
  }

  return {
    episode: `Episode ${epNum}`,
    episode_number: epNum,
    anime: { slug: animeSlug },
    has_next_episode: false,
    has_previous_episode: false,
    stream_url: "",
    download_urls,
    image_url: detail.poster,
    next_episode: null,
    previous_episode: null,
  }

}

export async function searchMedia(source: MediaSource, query: string, page = 1): Promise<SearchAnimeItem[] | MangaResponse> {
  if (!query.trim()) {
    if (source === "komik") {
      return {
        data: [],
        pagination: {
          current_page: 1,
          last_visible_page: 1,
          has_next_page: false,
          next_page: null,
          has_previous_page: false,
          previous_page: null,
        },
      }
    }
    return []
  }

  if (source === "komik") {
    return fetchApi<MangaResponse>(`/komik/search/${encodeURIComponent(query)}/${page}`, { cache: "no-store" })
  }

  if (source === "anime1") {
    interface ApiSearchItem { title: string; slug: string; poster: string; episode?: string; rating?: string }
    const res = await fetchApi<ApiResponse<ApiSearchItem[]>>(`/anime/search/${encodeURIComponent(query)}`, { cache: "no-store" })
    const items = res.data ?? []
    return items.map((item) => ({
      title: item.title,
      slug: item.slug,
      poster: item.poster,
      info: item.episode || "",
      sub_info: item.rating || "",
    }))
  }

  interface ApiAnime2SearchItem { title: string; slug: string; poster: string; type?: string; season?: string; rating?: string }
  const res2 = await fetchApi<ApiResponse<ApiAnime2SearchItem[]>>(`/anime2/search/${encodeURIComponent(query)}`, { cache: "no-store" })
  const items2 = res2.data ?? []
  return items2.map((item) => ({
    title: item.title,
    slug: item.slug,
    poster: item.poster,
    info: `${item.type || ""} | ${item.season || ""}`,
    sub_info: item.rating || "",
  }))
}
