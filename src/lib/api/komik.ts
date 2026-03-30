import { fetchApi } from "./config";
import { Pagination } from "./types";

export interface MangaItem {
  title: string;
  poster: string;
  chapter: string;
  date: string;
  reader_count?: string;
  score?: string;
  type: string;
  slug: string;
}

export interface MangaResponse {
  data: MangaItem[];
  pagination: Pagination;
}

export interface Chapter {
  chapter: string;
  date: string;
  chapter_id: string;
}

export interface KomikDetailData {
  title: string;
  poster: string;
  description: string;
  status: string;
  type: string;
  release_date: string;
  author: string;
  total_chapter: string;
  updated_on: string;
  genres: string[];
  chapters: Chapter[];
}

export interface KomikDetailResponse {
  status: boolean;
  data: KomikDetailData;
}

export interface ChapterData {
  title: string;
  next_chapter_id: string;
  prev_chapter_id: string;
  list_chapter: string;
  images: string[];
}

export interface ChapterResponse {
  message: string;
  data: ChapterData;
}

const REVALIDATE_TIME = 3600;

async function fetchKomikType(type: string, page: number): Promise<MangaResponse> {
  return await fetchApi<MangaResponse>(`/komik/${type}/${page}`, {
      next: { revalidate: REVALIDATE_TIME }
  });
}

export async function fetchManga(page: number): Promise<MangaResponse> {
  return fetchKomikType("manga", page);
}

export async function fetchManhwa(page: number): Promise<MangaResponse> {
  return fetchKomikType("manhwa", page);
}

export async function fetchManhua(page: number): Promise<MangaResponse> {
  return fetchKomikType("manhua", page);
}

export async function fetchKomikDetail(komikId: string): Promise<KomikDetailData> {
  const res = await fetchApi<KomikDetailResponse>(`/komik/detail/${encodeURIComponent(komikId)}`, {
      next: { revalidate: REVALIDATE_TIME / 2 }
  });

  if (!res || !res.status || !res.data) {
    throw new Error("Komik detail payload invalid");
  }

  return res.data;
}

export async function fetchChapter(slug: string): Promise<ChapterData> {
  const res = await fetchApi<ChapterResponse>(`/komik/chapter/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE_TIME * 24 }
  });

  if (res.data) {
    return res.data;
  }

  throw new Error("Failed to fetch chapter");
}

export async function searchKomik(query: string, page: number): Promise<MangaResponse> {
  return await fetchApi<MangaResponse>(`/komik/search/${encodeURIComponent(query)}/${page}`, {
      cache: "no-store"
  });
}
