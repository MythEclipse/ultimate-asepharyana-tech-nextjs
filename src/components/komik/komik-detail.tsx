"use client";

import Link from "next/link";
import Image from "next/image";
import { GlitchText } from "@/components/ui/glitch-text";
import { KomikDetailData } from "@/lib/api/komik";
import { useState } from "react";

interface KomikDetailViewProps {
  data: KomikDetailData;
}

export function KomikDetailView({ data }: KomikDetailViewProps) {
  const [reverseOrder, setReverseOrder] = useState(false);
  const chapters = data.chapters ? (reverseOrder ? [...data.chapters].reverse() : data.chapters) : [];

  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Immersive Header */}
      <div className="absolute top-0 left-0 w-full h-[60vh] md:h-[80vh] pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat blur-[100px] opacity-20"
          style={{ backgroundImage: `url(${data.poster})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 pt-32 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Metadata Display */}
          <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-8 shrink-0">
            <div className="relative aspect-[3/4.2] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-border/20 group">
              <Image 
                src={data.poster} 
                alt={data.title}
                width={400}
                height={560}
                priority
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="space-y-4 glass p-6 rounded-[2rem] border border-border/10 shadow-xl">
              <DetailRow label="Type" value={data.type || "Unknown"} />
              <DetailRow label="Status" value={data.status || "Unknown"} />
              <DetailRow label="Author" value={data.author} />
              <DetailRow label="Released" value={data.release_date} />
              <DetailRow label="Updated" value={data.updated_on} />
              <DetailRow label="Total Chapters" value={data.total_chapter} />
            </div>
            
            <Link 
               href={data.chapters && data.chapters[data.chapters.length - 1] ? `/komik/chapter/${data.chapters[data.chapters.length - 1].chapter_id}` : "#"}
               className="w-full py-4 text-center rounded-[2rem] bg-orange-500 text-white font-black uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 transition-colors"
            >
                Read First Chapter
            </Link>
          </div>

          <div className="flex-1 space-y-12">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter italic uppercase leading-tight drop-shadow-2xl">
                <GlitchText text={data.title} className="text-foreground" />
              </h1>
            </header>

            <div className="flex flex-wrap gap-3">
              {data.genres?.map((genre, i) => (
                <span 
                  key={i} 
                  className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-orange-500/10 text-orange-500 border border-orange-500/20 cursor-default"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-black uppercase tracking-widest text-foreground/80">Synopsis</h3>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {data.description}
              </p>
            </div>

            {/* Chapters Array */}
            <div className="space-y-6 pt-8 border-t border-border/20">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black uppercase tracking-tight italic drop-shadow-lg">Chapters</h3>
                <button 
                  onClick={() => setReverseOrder(!reverseOrder)} 
                  className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border/20 hover:bg-muted/50 transition-colors"
                >
                  Sort: {reverseOrder ? 'Oldest First' : 'Newest First'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-orange-500/20 hover:scrollbar-thumb-orange-500/40">
                {chapters.map((ch, i) => (
                  <Link 
                    key={ch.chapter_id || i}
                    // URLEncode the ID to prevent trailing slashes breaking the path
                    href={`/komik/chapter/${encodeURIComponent(ch.chapter_id)}`}
                    className="group relative flex flex-col justify-center p-5 rounded-2xl glass border border-border/10 hover:border-orange-500/50 transition-all hover:scale-[1.02] active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 text-sm font-black text-foreground group-hover:text-orange-500 transition-colors truncate">
                      {ch.chapter}
                    </span>
                    <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mt-1">
                      {ch.date}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  if (!value || value === "Unknown" || value === "?" || value === "") return null;
  return (
    <div className="flex items-center justify-between py-1 border-b border-border/10 last:border-0 gap-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 shrink-0">{label}</span>
      <span className="text-sm font-bold text-foreground truncate max-w-[150px] text-right" title={value}>{value}</span>
    </div>
  );
}
