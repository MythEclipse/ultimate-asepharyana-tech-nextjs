"use client"

import { use } from "react"
import { KomikListPage } from "@/components/komik/komik-list-page"
import { fetchManga } from "@/lib/api/komik"

export default function Page({ params }: { params: Promise<{ page: string }> }) {
  const pageStr = use(params).page
  const page = parseInt(pageStr) || 1

  return (
    <KomikListPage
      page={page}
      fetchFn={fetchManga}
      queryKeyBase="manga-list"
      baseUrl="/komik/manga"
      variant="manga"
      heroExpose={{
        title: "MANGA",
        accent: "CENTRAL",
        description: "Accessing premium Japanese literary transmissions from the global cluster.",
        accentTextClass: "text-cyan-500",
        tagClass: "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400",
        introText: "Japanese Archive",
        colorClass: "border-cyan-500/20",
        linkTextClass: "text-cyan-500",
      }}
    />
  )
}
