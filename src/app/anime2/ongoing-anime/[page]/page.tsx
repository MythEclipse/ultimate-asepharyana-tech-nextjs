"use client"

import { useParams } from "next/navigation"
import { AnimeListPage } from "@/components/anime/anime-list-page"

export default function Page() {
  const params = useParams()
  const page = parseInt(params?.page ?? "1") || 1

  return <AnimeListPage source={2} page={page} type="ongoing" />
}
