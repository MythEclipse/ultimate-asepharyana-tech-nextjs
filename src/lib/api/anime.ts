import { fetchApi } from "./config";
import { ApiResponse, Pagination } from "./types";
import { fetchMediaList, fetchMediaDetail, fetchMediaStream, searchMedia } from "./media";

export interface Anime1OngoingItem {
  title: string;
  slug: string;
  poster: string;
  current_episode: string;
  anime_url: string;
}

export interface Anime2OngoingItem {
  title: string;
  slug: string;
  poster: string;
  score: string;
  anime_url: string;
}

export interface Anime2CompleteItem {
  title: string;
  slug: string;
  poster: string;
  episode_count: string;
  anime_url: string;
}

export interface Anime1Data {
  ongoing_anime: Anime1OngoingItem[];
  complete_anime: Anime2CompleteItem[];
}

export interface Anime2Data {
  ongoing_anime: Anime2OngoingItem[];
  complete_anime: Anime2CompleteItem[];
}

export interface Genre {
  name: string;
  slug: string;
  url: string;
}

export interface EpisodeList {
  episode: string;
  slug: string;
}

export interface Recommendation {
  title: string;
  slug: string;
  poster: string;
  status?: string | null;
  type?: string | null;
}

export interface DownloadLinkItem {
  name: string;
  url: string;
}

export interface DownloadGroup {
  resolution: string;
  links: DownloadLinkItem[];
}

export interface AnimeDetailData {
  title: string;
  alternative_title: string;
  poster: string;
  type: string | null;
  status: string | null;
  release_date: string;
  studio: string;
  synopsis: string;
  producers?: string[];
  genres: Genre[];
  episode_lists: EpisodeList[];
  batch: EpisodeList[];
  recommendations: Recommendation[];
  score?: string;
  duration?: string;
  downloads?: DownloadGroup[];
}

export interface SearchAnimeItem {
  title: string;
  slug: string;
  poster: string;
  info: string;
  sub_info: string;
}

export interface EpisodeInfo {
    slug: string;
}

export interface DownloadLink {
    server: string;
    url: string;
}

export interface AnimeFullData {
    episode: string;
    episode_number: string;
    anime: { slug: string };
    has_next_episode: boolean;
    has_previous_episode: boolean;
    stream_url: string;
    download_urls: Record<string, DownloadLink[]>;
    image_url: string;
    next_episode: EpisodeInfo | null;
    previous_episode: EpisodeInfo | null;
}

export type AnimeSource = 1 | 2;

const REVALIDATE_TIME = 3600;

function getAnimeUrl(source: AnimeSource, path: string): string {
    const prefix = source === 2 ? "/anime2" : "/anime";
    return `${prefix}${path}`;
}


export async function fetchAnimeIndex(source: AnimeSource): Promise<Anime1Data | Anime2Data> {
  const response = await fetchApi<ApiResponse<Anime1Data | Anime2Data>>(getAnimeUrl(source, ""), {
    next: { revalidate: REVALIDATE_TIME }
  });

  if (!response.data) throw new Error("No data found");
  return response.data;
}

export async function fetchAnimeOngoing(source: AnimeSource, page: number): Promise<{ data: (Anime1OngoingItem | Anime2OngoingItem)[]; pagination: Pagination }> {
  const key = source === 2 ? "anime2" : "anime1"
  return fetchMediaList(key, "ongoing", page) as Promise<{ data: (Anime1OngoingItem | Anime2OngoingItem)[]; pagination: Pagination }>;
}

export async function fetchAnimeComplete(source: AnimeSource, page: number): Promise<{ data: Anime2CompleteItem[]; pagination: Pagination }> {
  const key = source === 2 ? "anime2" : "anime1"
  return fetchMediaList(key, "complete", page) as Promise<{ data: Anime2CompleteItem[]; pagination: Pagination }>;
}

export async function fetchAnimeDetail(source: AnimeSource, slug: string): Promise<AnimeDetailData> {
  const key = source === 2 ? "anime2" : "anime1"
  const data = await fetchMediaDetail(key, slug) as AnimeDetailData

  if (source === 2) {
    if (!data.episode_lists || data.episode_lists.length === 0) {
      data.episode_lists = [];
      const allGroups = [...(data.downloads || []), ...(data.batch as unknown as DownloadGroup[] || [])];

      for (const group of allGroups) {
        const resStr = group.resolution || "";
        const epMatch = resStr.match(/(?:Episode\s*)?(\d+)/i);
        if (epMatch && !resStr.toLowerCase().includes("batch") && !resStr.toLowerCase().includes("per episode")) {
          const epNum = epMatch[1];
          if (!data.episode_lists.find(e => e.slug === `${slug}-episode-${epNum}`)) {
            data.episode_lists.push({ episode: `Episode ${epNum}`, slug: `${slug}-episode-${epNum}` });
          }
        }
      }

      data.episode_lists.sort((a, b) => {
        const numA = parseInt(a.episode.replace("Episode ", ""));
        const numB = parseInt(b.episode.replace("Episode ", ""));
        return numB - numA;
      });
    }
  }

  return data;
}

export async function fetchAnimeStream(source: AnimeSource, slug: string): Promise<AnimeFullData> {
  const key = source === 2 ? "anime2" : "anime1"
  return fetchMediaStream(key, slug)
}

export async function searchAnime(source: AnimeSource, query: string): Promise<SearchAnimeItem[]> {
  const key = source === 2 ? "anime2" : "anime1"
  return searchMedia(key, query) as Promise<SearchAnimeItem[]>
}

export const fetchAnime1Ongoing = (page: number) => fetchAnimeOngoing(1, page);
export const fetchAnime2Ongoing = (page: number) => fetchAnimeOngoing(2, page);
export const fetchAnime1Complete = (page: number) => fetchAnimeComplete(1, page);
export const fetchAnime2Complete = (page: number) => fetchAnimeComplete(2, page);
export const fetchAnime1Detail = (slug: string) => fetchAnimeDetail(1, slug);
export const fetchAnime2Detail = (slug: string) => fetchAnimeDetail(2, slug);
export const fetchAnime1Stream = (slug: string) => fetchAnimeStream(1, slug);
export const fetchAnime2Stream = (slug: string) => fetchAnimeStream(2, slug);
export const searchAnime1 = (query: string) => searchAnime(1, query);
export const searchAnime2 = (query: string) => searchAnime(2, query);

// Additional OpenAPI-route wrappers
export async function fetchAnimeGenre(source: AnimeSource, genreSlug: string): Promise<ApiResponse<unknown>> {
  return await fetchApi<ApiResponse<unknown>>(`${getAnimeUrl(source, "/genre")}/${encodeURIComponent(genreSlug)}`, { next: { revalidate: REVALIDATE_TIME } });
}

export async function fetchAnimeGenrePage(source: AnimeSource, genreSlug: string, page: number): Promise<ApiResponse<unknown>> {
  return await fetchApi<ApiResponse<unknown>>(`${getAnimeUrl(source, "/genre")}/${encodeURIComponent(genreSlug)}/${page}`, { next: { revalidate: REVALIDATE_TIME } });
}

export async function fetchAnimeGenreList(source: AnimeSource): Promise<ApiResponse<unknown>> {
  return await fetchApi<ApiResponse<unknown>>(`${getAnimeUrl(source, "/genre_list")}`, { next: { revalidate: REVALIDATE_TIME } });
}

export async function fetchAnimeLatest(source: AnimeSource, slug: string): Promise<ApiResponse<unknown>> {
  return await fetchApi<ApiResponse<unknown>>(`${getAnimeUrl(source, "/latest")}/${encodeURIComponent(slug)}`, { next: { revalidate: REVALIDATE_TIME } });
}

export async function fetchAnimeSearchPath(source: AnimeSource, query: string, page?: number): Promise<ApiResponse<unknown>> {
  const queryPath = encodeURIComponent(query);
  const endpoint = page && page > 1
    ? `${getAnimeUrl(source, "/search")}/${queryPath}/${page}`
    : `${getAnimeUrl(source, "/search")}/${queryPath}`;
  return await fetchApi<ApiResponse<unknown>>(endpoint, { cache: "no-store" });
}

