"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { fetchChapter, type ChapterData } from "@/lib/api/komik"
import { MediaChapterShell } from "@/components/shared/media-chapter-shell"

function KomikChapterView({ data }: { data: ChapterData }) {
  let listSlug = data.list_chapter
  if (listSlug.endsWith("/")) listSlug = listSlug.slice(0, -1)
  const parts = listSlug.split("/")
  const komikId = parts[parts.length - 1]

  return (
    <MediaChapterShell
      title={data.title}
      backHref={`/komik/detail/${encodeURIComponent(komikId)}`}
      prevHref={data.prev_chapter_id ? `/komik/chapter/${encodeURIComponent(data.prev_chapter_id)}` : undefined}
      nextHref={data.next_chapter_id ? `/komik/chapter/${encodeURIComponent(data.next_chapter_id)}` : undefined}
      chapterImageUrls={data.images ?? []}
    />
  )
}

export default function KomikChapterRoute() {
  const params = useParams()
  const rawSlug = params?.slug
  const slug = Array.isArray(rawSlug) ? rawSlug[0] ?? "" : rawSlug ?? ""
  const [data, setData] = useState<ChapterData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchChapter(slug).then(d => {
      setData(d)
      setIsLoading(false)
    }).catch(() => {
      notFound()
    })
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!data) notFound()

  return <KomikChapterView data={data} />
}
