"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchChapter, type ChapterData } from "@/lib/api/komik"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { CachedImage } from "@/components/ui/cached-image"

function KomikChapterView({ data }: { data: ChapterData }) {
  let listSlug = data.list_chapter
  if (listSlug.endsWith('/')) listSlug = listSlug.slice(0, -1)
  const parts = listSlug.split('/')
  const komikId = parts[parts.length - 1]

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-orange-500/30 transition-colors duration-500">
      {/* Sticky Header Navigation */}
      <nav className="sticky top-0 z-[100] w-full backdrop-blur-md bg-background/80 border-b border-border/10 py-4 px-4 md:px-8 flex items-center justify-between transition-colors">
        <Link 
          href={`/komik/detail/${encodeURIComponent(komikId)}`}
          className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-orange-500 transition-colors"
        >
          <span className="text-orange-500 group-hover:-translate-x-1 transition-transform">←</span> 
          <span className="hidden sm:inline">Back</span>
        </Link>

        <h1 className="text-center font-black text-sm md:text-base italic truncate max-w-[50%] text-muted-foreground/80">
          {data.title}
        </h1>

        <div className="flex items-center gap-2">
           {data.prev_chapter_id ? (
             <Button 
               href={`/komik/chapter/${encodeURIComponent(data.prev_chapter_id)}`}
               variant="secondary"
               className="p-2 md:px-6 md:py-2 rounded-xl text-[10px] md:text-xs"
             >
                <span className="sm:hidden">Prev</span>
                <span className="hidden sm:inline">Previous</span>
             </Button>
           ) : (
             <button disabled className="px-4 py-2 bg-muted/20 text-muted-foreground/30 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs cursor-not-allowed">
               Prev
             </button>
           )}

           {data.next_chapter_id ? (
             <Button 
               href={`/komik/chapter/${encodeURIComponent(data.next_chapter_id)}`}
               className="p-2 md:px-6 md:py-2 rounded-xl text-[10px] md:text-xs"
             >
                Next
             </Button>
           ) : (
             <button disabled className="px-4 py-2 bg-muted/20 text-muted-foreground/30 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs cursor-not-allowed">
               Next
             </button>
           )}
        </div>
      </nav>

      {/* Infinite Scroll Image Render */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center bg-card/10 min-h-screen shadow-2xl transition-colors">
          {data.images?.map((src, idx) => (
             <CachedImage
               key={idx}
               src={src}
               alt={`Page ${idx + 1}`}
               loading="lazy"
               className="w-full h-auto block select-none px-0"
               retryEnabled
             />
          ))}

          {/* End of Chapter Sentinel */}
          <div className="w-full py-24 flex flex-col items-center justify-center gap-8 border-t border-border/10 mt-10">
              <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-red-600 rounded-full" />
              <Heading as="h3" className="text-2xl text-muted-foreground/50">End of Chapter</Heading>
              
              <div className="flex gap-4">
                  <Button 
                      href={`/komik/detail/${encodeURIComponent(komikId)}`}
                      variant="secondary"
                      className="px-8 py-4 rounded-full"
                  >
                      Index
                  </Button>
                  {data.next_chapter_id && (
                     <Button 
                        href={`/komik/chapter/${encodeURIComponent(data.next_chapter_id)}`}
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 shadow-orange-500/20"
                     >
                        Next Chapter
                     </Button>
                  )}
              </div>
          </div>
      </div>
    </main>
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
