import { notFound } from "next/navigation"

import { KomikListPage } from "@/components/komik/komik-list-page"
import { getKomikCategoryConfig, parseKomikCategoryParam } from "@/lib/utils/komik-routes"
import { parsePageParam } from "@/lib/utils/route-params"

export default async function KomikCategoryPage({ params }: { params: Promise<{ category: string; page: string }> }) {
  const { category, page } = await params
  const parsedCategory = parseKomikCategoryParam(category)

  if (!parsedCategory) {
    notFound()
  }

  const config = getKomikCategoryConfig(parsedCategory)

  return (
    <KomikListPage
      page={parsePageParam(page)}
      fetchFn={config.fetchFn}
      queryKeyBase={config.queryKeyBase}
      baseUrl={config.baseUrl}
      variant={parsedCategory}
      heroExpose={config.hero}
    />
  )
}
