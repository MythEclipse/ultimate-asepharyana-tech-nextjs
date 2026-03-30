"use client"

import { use } from "react"
import { KomikListPage } from "@/components/komik/komik-list-page"
import { fetchManhua } from "@/lib/api/komik"

export default function Page({ params }: { params: Promise<{ page: string }> }) {
  const pageStr = use(params).page
  const page = parseInt(pageStr) || 1

  return (
    <KomikListPage
      page={page}
      fetchFn={fetchManhua}
      queryKeyBase="manhua-list"
      baseUrl="/komik/manhua"
      variant="manhua"
      heroExpose={{
        title: "MANHUA",
        accent: "PROTOCOL",
        description: "Accessing legendary Chinese literary transmissions and high-fidelity scroll data.",
        accentTextClass: "text-red-500",
        tagClass: "bg-red-500/10 border border-red-500/20 text-red-400",
        introText: "Chinese Archive",
        colorClass: "border-red-500/20",
        linkTextClass: "text-red-500",
      }}
    />
  )
}
