"use client"

import { useParams } from "next/navigation"
import { AnimeListPage } from "@/components/anime/anime-list-page"

export default function Page() {
  const params = useParams()
  const pageParam = params?.page
  const page = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "1") || 1

  return <AnimeListPage source={1} page={page} type="complete" />
}
