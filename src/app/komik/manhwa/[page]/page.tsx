"use client"

import { use } from "react"
import { KomikListPage } from "@/components/komik/komik-list-page"
import { fetchManhwa } from "@/lib/api/komik"

export default function Page({ params }: { params: Promise<{ page: string }> }) {
  const pageStr = use(params).page
  const page = parseInt(pageStr) || 1

  return (
    <KomikListPage
      page={page}
      fetchFn={fetchManhwa}
      queryKeyBase="manhwa-list"
      baseUrl="/komik/manhwa"
      variant="manhwa"
      heroExpose={{
        title: "MANHWA",
        accent: "SYSTEM",
        description: "Synchronizing with the neural web for Korean literary transmissions and digital scroll data.",
        accentTextClass: "text-indigo-500",
        tagClass: "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400",
        introText: "Korean Archive",
        colorClass: "border-indigo-500/20",
        linkTextClass: "text-indigo-500",
      }}
    />
  )
}
