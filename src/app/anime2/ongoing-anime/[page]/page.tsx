"use client"

import { use } from "react"
import { AnimeListPage } from "@/components/anime/anime-list-page"

export default function Page({ 
  params 
}: { 
  params: Promise<{ page: string }> 
}) {
  const pageStr = use(params).page
  const page = parseInt(pageStr) || 1

  return <AnimeListPage source={2} page={page} type="ongoing" />
}
