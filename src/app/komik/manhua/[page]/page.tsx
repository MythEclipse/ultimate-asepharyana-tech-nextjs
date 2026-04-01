"use client"

import { KomikListPage } from "@/components/komik/komik-list-page"
import { fetchManhua } from "@/lib/api/komik"
import { parsePageParam, useRouteParam } from "@/lib/utils/route-params"
import { komikListBaseRoute } from "@/lib/utils/routes"

export default function Page() {
  const page = parsePageParam(useRouteParam("page"))

  return (
    <KomikListPage
      page={page}
      fetchFn={fetchManhua}
      queryKeyBase="manhua-list"
      baseUrl={komikListBaseRoute("manhua")}
      variant="manhua"
      heroExpose={{
        title: "MANHUA",
        accent: "LIST",
        description: "List of manhua updates.",
        accentTextClass: "text-red-500",
        tagClass: "bg-red-500/10 border border-red-500/20 text-red-400",
        introText: "Manhua",
        colorClass: "border-red-500/20",
        linkTextClass: "text-red-500",
      }}
    />
  )
}
