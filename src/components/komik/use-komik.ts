"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchManga, fetchManhua, fetchManhwa } from "@/lib/api/komik"

export function useKomikHubData() {
  const mangaQuery = useQuery({
    queryKey: ["komik-hub", "manga"],
    queryFn: () => fetchManga(1),
  })

  const manhwaQuery = useQuery({
    queryKey: ["komik-hub", "manhwa"],
    queryFn: () => fetchManhwa(1),
  })

  const manhuaQuery = useQuery({
    queryKey: ["komik-hub", "manhua"],
    queryFn: () => fetchManhua(1),
  })

  return {
    mangaQuery,
    manhwaQuery,
    manhuaQuery,
  }
}