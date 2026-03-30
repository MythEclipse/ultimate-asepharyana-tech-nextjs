"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchAnimeOngoing, fetchAnimeComplete, type AnimeSource } from "@/lib/api/anime"
import { type Pagination } from "@/lib/api/types"

export type AnimeListType = "ongoing" | "complete"

export function getAnimePrefix(source: AnimeSource) {
  return source === 2 ? "anime2" : "anime"
}

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

export function useAnimeListData(source: AnimeSource, page: number, type: AnimeListType) {
  const queryKey = ["anime-list", type, source, page]

  const query = useQuery<{ data: any[]; pagination: Pagination }, Error>({
    queryKey,
    queryFn: () => {
      if (type === "ongoing") {
        return fetchAnimeOngoing(source, page)
      }
      return fetchAnimeComplete(source, page)
    },
  })

  return query
}
