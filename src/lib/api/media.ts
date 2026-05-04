import type {
  AnimeDetailData,
  AnimeFullData,
  SearchAnimeItem,
} from "./anime"
import { fetchApi } from "./config"
import type {
  MangaResponse,
  KomikDetailData,
} from "./komik"
import { ApiResponse, Pagination } from "./types"

const REVALIDATE_TIME = 3600

type AnimeSource = "anime1" | "anime2"
export type MediaSource = AnimeSource | "komik"

interface MediaDownloadGroup {
  resolution?: string
  links?: { name: string; url: string }[]
}

type Anime2DetailWithBatch = Omit<AnimeDetailData, "batch"> & {
  batch?: MediaDownloadGroup[]
}

const NO_STORE_OPTIONS = { cache: "no-store" } as const
const REVALIDATE_OPTIONS = { next: { revalidate: REVALIDATE_TIME } } as const
const HALF_REVALIDATE_OPTIONS = { next: { revalidate: REVALIDATE_TIME / 2 } } as const

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

function buildListEndpoint(
  source: MediaSource,
  category: "ongoing" | "complete" | "manga" | "manhwa" | "manhua",
  page: number,
): string {
  if (source === "komik") {
    return `${getMediaPrefix(source)}/${category}/${page}`
  }

  const listSegment = category === "ongoing" ? "ongoing_anime" : "complete_anime"
  return `${getMediaPrefix(source)}/${listSegment}/${page}`
}

function buildDetailEndpoint(source: MediaSource, slug: string): string {
  return `${getMediaPrefix(source)}/detail/${encodeURIComponent(slug)}`
}

function buildSearchEndpoint(source: MediaSource, query: string, page: number): string {
  const encodedQuery = encodeURIComponent(query.trim())

  if (source === "komik") {
    return `/komik/search/${encodedQuery}/${page}`
  }

  return `${getMediaPrefix(source)}/search/${encodedQuery}`
}

function normalizeSearchQuery(query: string): string | null {
  const normalized = query.trim()
  return normalized.length > 0 ? normalized : null
}

function mapAnimeSearchItems<T extends { title: string; slug: string; poster: string; episode?: string; type?: string; season?: string; rating?: string }>(
  source: AnimeSource,
  items: T[],
): SearchAnimeItem[] {
  return items.map((item) => ({
    title: item.title,
    slug: item.slug,
    poster: item.poster,
    info: source === "anime1" ? item.episode ?? "" : `${item.type ?? ""} | ${item.season ?? ""}`,
    sub_info: item.rating ?? "",
  }))
}

function emptySearchResult(source: MediaSource): SearchAnimeItem[] | MangaResponse {
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

function parseAnime2Slug(slug: string): { animeSlug: string; episode: string } {
  const match = slug.match(/^(.*)-episode-(.*)$/)
  if (!match) {
    throw new Error("Invalid slug format for Anime2")
  }

  return { animeSlug: match[1], episode: match[2] }
}

function buildAnime2DownloadUrls(detail: Anime2DetailWithBatch, episode: string) {
  const downloadUrls: Record<string, { server: string; url: string }[]> = {}
  const groups = [...(detail.downloads ?? []), ...(detail.batch ?? [])]

  for (const group of groups) {
    const label = group.resolution ?? ""
    const epMatch = label.match(/(?:Episode\s*[:\s-]*|Ep\s*[:\s-]*|Eps\s*[:\s-]*)(\d+(\.\d+)?)/i)
    const epNum = epMatch ? epMatch[1] : label.match(/\d+(\.\d+)?/g)?.pop()
    const isMatching = epNum && (parseInt(epNum) === parseInt(episode) || epNum === episode)

    if (!isMatching || !group.links) {
      continue
    }

    downloadUrls[label] = group.links.map((link) => ({ server: link.name, url: link.url }))
  }

  return downloadUrls
}

const fetchRevalidated = <T>(endpoint: string) => fetchApi<T>(endpoint, REVALIDATE_OPTIONS)
const fetchHalfRevalidated = <T>(endpoint: string) => fetchApi<T>(endpoint, HALF_REVALIDATE_OPTIONS)
const fetchNoStore = <T>(endpoint: string) => fetchApi<T>(endpoint, NO_STORE_OPTIONS)

export async function fetchMediaList(source: "komik", category: "manga" | "manhwa" | "manhua", page: number): Promise<MangaResponse>
export async function fetchMediaList<T>(source: AnimeSource, category: "ongoing" | "complete", page: number): Promise<{ data: T[]; pagination: Pagination }>
export async function fetchMediaList<T>(
  source: MediaSource,
  category: "ongoing" | "complete" | "manga" | "manhwa" | "manhua",
  page: number,
): Promise<{ data: T[]; pagination: Pagination } | MangaResponse> {
  const endpoint = buildListEndpoint(source, category, page)

  if (source === "komik") {
    return fetchRevalidated<MangaResponse>(endpoint)
  }

  const response = await fetchRevalidated<ApiResponse<T[]>>(endpoint)
  const data = response.data ?? []
  const pagination = response.pagination ?? (response.meta as { pagination?: Pagination })?.pagination

  if (!pagination) {
    throw new Error("Missing pagination")
  }

  return { data, pagination }
}

export async function fetchMediaDetail(source: "komik", slug: string): Promise<KomikDetailData>
export async function fetchMediaDetail(source: AnimeSource, slug: string): Promise<AnimeDetailData>
export async function fetchMediaDetail(source: MediaSource, slug: string): Promise<AnimeDetailData | KomikDetailData> {
  const response = await fetchHalfRevalidated<ApiResponse<AnimeDetailData | KomikDetailData>>(buildDetailEndpoint(source, slug))

  if (!response.data) {
    throw new Error("No data found")
  }

  return response.data
}

export async function fetchMediaStream(source: AnimeSource, slug: string): Promise<AnimeFullData> {
  if (source === "anime1") {
    const response = await fetchRevalidated<ApiResponse<AnimeFullData>>(`/anime/full/${encodeURIComponent(slug)}`)

    if (!response.data) {
      throw new Error("No data found")
    }

    return response.data
  }

  const detail = (await fetchMediaDetail("anime2", slug)) as Anime2DetailWithBatch
  const { animeSlug, episode } = parseAnime2Slug(slug)

  return {
    episode: `Episode ${episode}`,
    episode_number: episode,
    anime: { slug: animeSlug },
    has_next_episode: false,
    has_previous_episode: false,
    stream_url: "",
    download_urls: buildAnime2DownloadUrls(detail, episode),
    image_url: detail.poster,
    next_episode: null,
    previous_episode: null,
  }
}

export async function searchMedia(source: "komik", query: string, page?: number): Promise<MangaResponse>
export async function searchMedia(source: AnimeSource, query: string, page?: number): Promise<SearchAnimeItem[]>
export async function searchMedia(source: MediaSource, query: string, page = 1): Promise<SearchAnimeItem[] | MangaResponse> {
  const normalizedQuery = normalizeSearchQuery(query)
  if (!normalizedQuery) {
    return emptySearchResult(source)
  }

  const endpoint = buildSearchEndpoint(source, normalizedQuery, page)

  if (source === "komik") {
    return fetchNoStore<MangaResponse>(endpoint)
  }

  const response = await fetchNoStore<ApiResponse<
    | { title: string; slug: string; poster: string; episode?: string; rating?: string }[] 
    | { title: string; slug: string; poster: string; type?: string; season?: string; rating?: string }[]
  >>(endpoint)

  return mapAnimeSearchItems(source, response.data ?? [])
}
