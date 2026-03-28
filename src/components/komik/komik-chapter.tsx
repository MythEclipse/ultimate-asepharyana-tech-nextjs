"use client";

import Link from "next/link";
import { ChapterData } from "@/lib/api/komik";
import React from "react";

interface KomikChapterViewProps {
  data: ChapterData;
}

export function KomikChapterView({ data }: KomikChapterViewProps) {
  // Parsing the base URL for the "Back to Comic" link.
  // The API returns list_chapter which is usually the komik's main URL endpoint.
  // If it's a full URL, we extract the slug or replace it if necessary.
  let listSlug = data.list_chapter;
  if (listSlug.endsWith('/')) listSlug = listSlug.slice(0, -1);
  const parts = listSlug.split('/');
  const komikId = parts[parts.length - 1];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-foreground selection:bg-orange-500/30">
      
      {/* Sticky Header Navigation */}
      <nav className="sticky top-0 z-[100] w-full backdrop-blur-md bg-black/60 border-b border-white/5 py-4 px-4 md:px-8 flex items-center justify-between">
        <Link 
          href={`/komik/detail/${encodeURIComponent(komikId)}`}
          className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-orange-500 transition-colors"
        >
          <span className="text-orange-500 group-hover:-translate-x-1 transition-transform">←</span> 
          <span className="hidden sm:inline">Back to Index</span>
        </Link>

        <h1 className="text-center font-black text-sm md:text-base italic truncate max-w-[50%] opacity-80">
          {data.title}
        </h1>

        <div className="flex items-center gap-2">
           {data.prev_chapter_id ? (
             <Link 
               href={`/komik/chapter/${encodeURIComponent(data.prev_chapter_id)}`}
               className="p-2 md:px-6 md:py-2 bg-white/5 hover:bg-orange-500/20 text-white hover:text-orange-500 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-colors"
             >
                <span className="sm:hidden">Prev</span>
                <span className="hidden sm:inline">Previous</span>
             </Link>
           ) : (
             <button disabled className="p-2 md:px-6 md:py-2 bg-white/5 text-white/30 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs cursor-not-allowed">
               Prev
             </button>
           )}

           {data.next_chapter_id ? (
             <Link 
               href={`/komik/chapter/${encodeURIComponent(data.next_chapter_id)}`}
               className="p-2 md:px-6 md:py-2 bg-white/10 hover:bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-colors"
             >
                Next
             </Link>
           ) : (
             <button disabled className="p-2 md:px-6 md:py-2 bg-white/5 text-white/30 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs cursor-not-allowed">
               Next
             </button>
           )}
        </div>
      </nav>

      {/* Infinite Scroll Image Render */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center bg-black min-h-screen">
          {data.images?.map((src, idx) => (
             // eslint-disable-next-line @next/next/no-img-element
             <img 
               key={idx}
               src={src}
               alt={`Page ${idx + 1}`}
               loading="lazy"
               className="w-full h-auto block select-none"
             />
          ))}

          {/* End of Chapter Sentinel */}
          <div className="w-full py-24 flex flex-col items-center justify-center gap-8 border-t border-white/5 mt-10">
              <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-red-600 rounded-full" />
              <h3 className="text-2xl font-black uppercase tracking-[0.3em] text-white/50 italic">End of Chapter</h3>
              
              <div className="flex gap-4">
                  <Link 
                      href={`/komik/detail/${encodeURIComponent(komikId)}`}
                      className="px-8 py-4 rounded-full border border-white/10 hover:border-orange-500 hover:text-orange-500 transition-colors uppercase tracking-widest font-black text-xs"
                  >
                      Index
                  </Link>
                  {data.next_chapter_id && (
                     <Link 
                        href={`/komik/chapter/${encodeURIComponent(data.next_chapter_id)}`}
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white hover:scale-105 active:scale-95 transition-transform uppercase tracking-widest font-black text-xs"
                     >
                        Next Chapter
                     </Link>
                  )}
              </div>
          </div>
      </div>
    </main>
  );
}
