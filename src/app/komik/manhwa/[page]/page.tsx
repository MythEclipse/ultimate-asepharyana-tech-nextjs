"use client"

import { KomikListPage } from "@/components/komik/komik-list-page"
import { fetchManhwa } from "@/lib/api/komik"
import { parsePageParam, useRouteParam } from "@/lib/utils/route-params"
import { komikListBaseRoute } from "@/lib/utils/routes"

export default function Page() {
  const page = parsePageParam(useRouteParam("page"))

  return (
    <KomikListPage
      page={page}
      fetchFn={fetchManhwa}
      queryKeyBase="manhwa-list"
      baseUrl={komikListBaseRoute("manhwa")}
      variant="manhwa"
      heroExpose={{
        title: "MANHWA",
        accent: "LIST",
        description: "List of manhwa updates.",
        accentTextClass: "text-indigo-500",
        tagClass: "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400",
        introText: "Manhwa",
        colorClass: "border-indigo-500/20",
        linkTextClass: "text-indigo-500",
      }}
    />
  )
}
