import { fetchApi } from "./config";
import { fetchMediaList, fetchMediaDetail, searchMedia } from "./media";
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

async function fetchKomikType(type: "manga" | "manhwa" | "manhua", page: number): Promise<MangaResponse> {
  return fetchMediaList("komik", type, page) as Promise<MangaResponse>
}

async function fetchKomikApi<T>(path: string, options?: RequestInit): Promise<T> {
  return fetchApi<T>(`/komik/${path}`, options);
}

export async function fetchManga(page: number): Promise<MangaResponse> {
  return fetchKomikType("manga", page)
}

export async function fetchManhwa(page: number): Promise<MangaResponse> {
  return fetchKomikType("manhwa", page)
}

export async function fetchManhua(page: number): Promise<MangaResponse> {
  return fetchKomikType("manhua", page)
}

export async function fetchKomikDetail(komikId: string): Promise<KomikDetailData> {
  return fetchMediaDetail("komik", komikId) as Promise<KomikDetailData>
}

export async function fetchChapter(slug: string): Promise<ChapterData> {
  const res = await fetchKomikApi<ChapterResponse>(`chapter/${encodeURIComponent(slug)}`, {
    next: { revalidate: REVALIDATE_TIME * 24 },
  });

  if (res.data) {
    return res.data;
  }

  throw new Error("Failed to fetch chapter");
}

export async function searchKomik(query: string, page: number): Promise<MangaResponse> {
  return searchMedia("komik", query, page) as Promise<MangaResponse>
}

export async function fetchKomikGenre(genreSlug: string): Promise<MangaResponse> {
  return fetchKomikApi<MangaResponse>(`genre/${encodeURIComponent(genreSlug)}`, {
    next: { revalidate: REVALIDATE_TIME },
  });
}

export async function fetchKomikGenrePage(genreSlug: string, page: number): Promise<MangaResponse> {
  return fetchKomikApi<MangaResponse>(`genre/${encodeURIComponent(genreSlug)}/${page}`, {
    next: { revalidate: REVALIDATE_TIME },
  });
}

export async function fetchKomikGenreList(): Promise<MangaResponse> {
  return fetchKomikApi<MangaResponse>(`genre_list`, {
    next: { revalidate: REVALIDATE_TIME },
  });
}

export async function fetchKomikPopular(slug: string): Promise<MangaResponse> {
  return fetchKomikApi<MangaResponse>(`popular/${encodeURIComponent(slug)}`, {
    next: { revalidate: REVALIDATE_TIME },
  });
}

