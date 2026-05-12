import { redirect } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  redirect(`/anime/source-2/detail/${encodeURIComponent(slug)}`)
}
