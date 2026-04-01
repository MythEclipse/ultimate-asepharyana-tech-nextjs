"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchAnimeOngoing, fetchAnimeComplete, fetchAnimeDetail, fetchAnimeStream, searchAnime, type AnimeSource, type Anime1OngoingItem, type Anime2OngoingItem, type Anime2CompleteItem } from "@/lib/api/anime"

export type AnimeListType = "ongoing" | "complete"

export function useAnimeHubData(source: AnimeSource) {
  const ongoingQuery = useQuery({
    queryKey: ["anime-hub", "ongoing", source],
    queryFn: () => fetchAnimeOngoing(source, 1),
  })

  const completeQuery = useQuery({
    queryKey: ["anime-hub", "complete", source],
    queryFn: () => fetchAnimeComplete(source, 1),
  })

  return { ongoingQuery, completeQuery }
}

import { useMediaListData } from "@/components/shared/use-media"

export function useAnimeListData(source: AnimeSource, page: number, type: AnimeListType) {
  const queryKey = `${type}-${source}`
  const isOngoing = type === "ongoing"

  const fetchFn = isOngoing
    ? (pageNumber: number) => fetchAnimeOngoing(source, pageNumber)
    : (pageNumber: number) => fetchAnimeComplete(source, pageNumber)

  return useMediaListData<Anime1OngoingItem | Anime2OngoingItem | Anime2CompleteItem>([queryKey, page], () => fetchFn(page))
}

export function useAnimeDetail(source: AnimeSource, slug: string) {
  return useQuery({
    queryKey: ["anime-detail", source, slug],
    queryFn: () => fetchAnimeDetail(source, slug),
  })
}

export function useAnimeStream(source: AnimeSource, slug: string) {
  return useQuery({
    queryKey: ["anime-stream", source, slug],
    queryFn: () => fetchAnimeStream(source, slug),
  })
}

export function useAnimeSearch(source: AnimeSource, query: string) {
  return useQuery({
    queryKey: ["anime-search", source, query],
    queryFn: () => searchAnime(source, query),
    enabled: query.trim().length > 0,
  })
}
