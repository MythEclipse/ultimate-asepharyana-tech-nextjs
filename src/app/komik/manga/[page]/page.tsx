"use client"

import { KomikListPage } from "@/components/komik/komik-list-page"
import { fetchManga } from "@/lib/api/komik"
import { parsePageParam, useRouteParam } from "@/lib/utils/route-params"
import { komikListBaseRoute } from "@/lib/utils/routes"

export default function Page() {
  const page = parsePageParam(useRouteParam("page"))

  return (
    <KomikListPage
      page={page}
      fetchFn={fetchManga}
      queryKeyBase="manga-list"
      baseUrl={komikListBaseRoute("manga")}
      variant="manga"
      heroExpose={{
        title: "MANGA",
        accent: "LIST",
        description: "List of manga updates.",
        accentTextClass: "text-cyan-500",
        tagClass: "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400",
        introText: "Manga",
        colorClass: "border-cyan-500/20",
        linkTextClass: "text-cyan-500",
      }}
    />
  )
}
