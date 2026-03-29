import { fetchApi } from "./config";
import { ApiResponse, Pagination } from "./types";

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
  // Extended fields for UI compatibility, kept as optional
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

// ----------------------------------------------------
// FETCH FUNCTIONS
// ----------------------------------------------------
const REVALIDATE_TIME = 3600; // Cache for 1 hour for static list endpoints

// === ANIME 1 (Otakudesu) ===

export async function fetchAnime1Index(): Promise<Anime1Data> {
  const data = await fetchApi<ApiResponse<Anime1Data>>("/anime", {
    next: { revalidate: REVALIDATE_TIME }
  });
  if (!data.data) throw new Error("No data found");
  return data.data;
}

export async function fetchAnime1Ongoing(page: number): Promise<{ data: Anime1OngoingItem[], pagination: Pagination }> {
  const res = await fetchApi<{ data: Anime1OngoingItem[], pagination: Pagination }>(`/anime/ongoing-anime/${page}`, {
      next: { revalidate: REVALIDATE_TIME }
  });
  return res;
}

export async function fetchAnime1Complete(page: number): Promise<{ data: Anime2CompleteItem[], pagination: Pagination }> {
  const res = await fetchApi<{ data: Anime2CompleteItem[], pagination?: Pagination }>(`/anime/complete-anime/${page}`, {
      next: { revalidate: REVALIDATE_TIME }
  });
  return {
    data: res.data || [],
    pagination: res.pagination || { current_page: 1, last_visible_page: 1, has_next_page: false, next_page: null, has_previous_page: false, previous_page: null }
  };
}

export async function fetchAnime1Detail(slug: string): Promise<AnimeDetailData> {
  const res = await fetchApi<ApiResponse<AnimeDetailData>>(`/anime/detail/${slug}`, {
      next: { revalidate: REVALIDATE_TIME / 2 } // Revalidate detail pages every 30 minutes
  });
  if (!res.data) throw new Error("No data found");
  return res.data;
}

export async function fetchAnime1Stream(slug: string): Promise<AnimeFullData> {
  const res = await fetchApi<ApiResponse<AnimeFullData>>(`/anime/full/${slug}`, {
      next: { revalidate: REVALIDATE_TIME } // Stream URLs expire or update dynamically
  });
  if (!res.data) throw new Error("No data found");
  return res.data;
}

export async function searchAnime1(query: string): Promise<SearchAnimeItem[]> {
  interface ApiSearchItem { title: string; slug: string; poster: string; episode: string; anime_url: string; genres: string[]; status: string; rating: string; }
  const res = await fetchApi<{ data: ApiSearchItem[] }>(`/anime/search?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
  return (res.data || []).map(item => ({
      title: item.title,
      slug: item.slug,
      poster: item.poster,
      info: item.episode,
      sub_info: item.rating
  }));
}

// === ANIME 2 (Alqanime) ===

export async function fetchAnime2Index(): Promise<Anime2Data> {
  const data = await fetchApi<{ data: Anime2Data }>("/anime2", {
      next: { revalidate: REVALIDATE_TIME }
  });
  return data.data;
}

export async function fetchAnime2Ongoing(page: number): Promise<{ data: Anime2OngoingItem[], pagination: Pagination }> {
  const res = await fetchApi<ApiResponse<Anime2OngoingItem[]>>(`/anime2/ongoing-anime/${page}`, {
      next: { revalidate: REVALIDATE_TIME }
  });
  return {
    data: res.data || [],
    pagination: res.pagination || { current_page: 1, last_visible_page: 1, has_next_page: false, next_page: null, has_previous_page: false, previous_page: null }
  };
}

export async function fetchAnime2Complete(page: number): Promise<{ data: Anime2CompleteItem[], pagination: Pagination }> {
  // Respecting the KIA fix for pagination
  const res = await fetchApi<ApiResponse<Anime2CompleteItem[]>>(`/anime2/complete-anime/${page}`, {
      next: { revalidate: REVALIDATE_TIME }
  });
  return {
    data: res.data || [],
    pagination: res.pagination || { current_page: 1, last_visible_page: 1, has_next_page: false, next_page: null, has_previous_page: false, previous_page: null }
  };
}

export async function fetchAnime2Detail(slug: string): Promise<AnimeDetailData> {
  const res = await fetchApi<ApiResponse<AnimeDetailData>>(`/anime2/detail/${slug}`, {
      next: { revalidate: REVALIDATE_TIME / 2 } // Revalidate every 30 mins to load new batch injections
  });
  if (!res.data) throw new Error("No data found");
  const data = res.data;
  
  // Retrofit Anime 2 episodes to Anime 1 structure for the unified UI
  if (!data.episode_lists || data.episode_lists.length === 0) {
      data.episode_lists = [];
      const allGroups = [...(data.downloads || []), ...(data.batch as unknown as DownloadGroup[] || [])];
      for (const group of allGroups) {
          const resStr = group.resolution || "";
          const epMatch = resStr.match(/(?:Episode\s*)?(\d+)/i);
          if (epMatch && !resStr.toLowerCase().includes("batch") && !resStr.toLowerCase().includes("per episode")) {
              const epNum = epMatch[1];
              // Avoid duplicates if both downloads and batch have the same episode
              if (!data.episode_lists.find(e => e.slug === `${slug}-episode-${epNum}`)) {
                  data.episode_lists.push({
                      episode: `Episode ${epNum}`, 
                      slug: `${slug}-episode-${epNum}`
                  });
              }
          }
      }
      // Sort episodes descending
      data.episode_lists.sort((a, b) => {
          const numA = parseInt(a.episode.replace("Episode ", ""));
          const numB = parseInt(b.episode.replace("Episode ", ""));
          return numB - numA;
      });
  }

  return data;
}

export async function searchAnime2(query: string): Promise<SearchAnimeItem[]> {
  interface ApiAnime2SearchItem { title: string; slug: string; poster: string; description: string; anime_url: string; genres: string[]; rating: string; type: string; season: string; }
  const res = await fetchApi<ApiResponse<ApiAnime2SearchItem[]>>(`/anime2/search?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
  return (res.data || []).map(item => ({
      title: item.title,
      slug: item.slug,
      poster: item.poster,
      info: `${item.type} | ${item.season}`,
      sub_info: item.rating
  }));
}

export async function fetchAnime2Stream(slug: string): Promise<AnimeFullData> {
  // Replicating the mock stream adapter in Rust Leptos
  const match = slug.match(/^(.*)-episode-(.*)$/);
  if (!match) throw new Error("Invalid slug format for Anime2");
  
  const animeSlug = match[1];
  const epNum = match[2];

  const detail = await fetchAnime2Detail(animeSlug);
  
  const download_urls: Record<string, DownloadLink[]> = {};
  
  const allGroups = [...(detail.downloads || []), ...(detail.batch as unknown as DownloadGroup[] || [])];
  
  for (const group of allGroups) {
      const resStr = group.resolution || "";
      const resClean = resStr.replace(/Episode/i, "").trim();
      const matchFound = parseInt(resClean) === parseInt(epNum) || resClean === epNum;
      
      if (matchFound) {
          download_urls[resStr] = group.links.map(l => ({ server: l.name, url: l.url }));
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
  };
}
