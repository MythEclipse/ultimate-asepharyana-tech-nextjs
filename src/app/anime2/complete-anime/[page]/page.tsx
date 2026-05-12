import { redirect } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params

  redirect(`/anime/source-2/complete-anime/${page}`)
}
