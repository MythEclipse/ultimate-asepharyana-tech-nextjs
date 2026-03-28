"use client";

import Link from "next/link";
import { GlitchText } from "@/components/ui/glitch-text";
import { AnimeFullData } from "@/lib/api/anime";

interface AnimeStreamViewProps {
  data: AnimeFullData;
  source: 1 | 2;
}

export function AnimeStreamView({ data, source }: AnimeStreamViewProps) {
  const prefix = source === 2 ? "anime2" : "anime";

  return (
    <main className="min-h-screen bg-background relative selection:bg-primary/30">
      {/* Immersive Background */}
      <div className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[100px] opacity-20"
          style={{ backgroundImage: `url(${data.image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 pt-32 pb-24 relative z-10 w-full max-w-6xl">
        <header className="mb-8 space-y-4">
          <Link 
            href={`/${prefix}/detail/${data.anime.slug}`}
            className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
          >
            ← Back to Series
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic uppercase drop-shadow-2xl">
              <GlitchText text={data.episode} className="text-foreground" />
            </h1>
          </div>
        </header>

        {/* Video Player Core */}
        <div className="w-full bg-black rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-border/20 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-1000 z-0" />
          <div className="relative aspect-video w-full z-10 bg-black flex items-center justify-center">
            {data.stream_url ? (
              <iframe 
                src={data.stream_url} 
                className="w-full h-full border-0" 
                allowFullScreen 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
                <div className="text-center text-muted-foreground/50 font-black tracking-widest uppercase">
                    Stream URL Unavailable
                </div>
            )}
          </div>
        </div>

        {/* Playback Controls & Navigation */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {data.has_previous_episode && data.previous_episode ? (
            <Link 
              href={`/${prefix}/watch/${data.previous_episode.slug}`}
              className="flex items-center justify-center gap-3 px-4 py-5 glass border border-border/20 rounded-2xl hover:bg-muted/50 hover:border-primary/50 transition-all font-black uppercase tracking-widest text-xs md:text-sm shadow-lg group"
            >
              <span className="text-primary group-hover:-translate-x-1 transition-transform">←</span> 
              <span className="hidden sm:inline">Previous Episode</span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <button disabled className="flex items-center justify-center gap-3 px-4 py-5 glass border border-border/10 rounded-2xl opacity-50 cursor-not-allowed font-black uppercase tracking-widest text-xs md:text-sm text-muted-foreground shadow-inner">
              <span className="text-muted-foreground/50">←</span> 
              <span className="hidden sm:inline">Previous Episode</span>
              <span className="sm:hidden">Prev</span>
            </button>
          )}

          {data.has_next_episode && data.next_episode ? (
            <Link 
              href={`/${prefix}/watch/${data.next_episode.slug}`}
              className="flex items-center justify-center gap-3 px-4 py-5 bg-foreground text-background rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all font-black uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-foreground/20 group"
            >
              <span className="hidden sm:inline">Next Episode</span>
              <span className="sm:hidden">Next</span> 
              <span className="text-background group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ) : (
            <button disabled className="flex items-center justify-center gap-3 px-4 py-5 glass border border-border/10 rounded-2xl opacity-50 cursor-not-allowed font-black uppercase tracking-widest text-xs md:text-sm text-muted-foreground shadow-inner">
              <span className="hidden sm:inline">Next Episode</span>
              <span className="sm:hidden">Next</span> 
              <span className="text-muted-foreground/50">→</span>
            </button>
          )}
        </div>

        {/* Download Matrix */}
        {data.download_urls && Object.keys(data.download_urls).length > 0 && (
          <div className="mt-16 space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-widest italic text-center drop-shadow-xl">Resolution Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(data.download_urls).map(([resolution, links]) => (
                <div key={resolution} className="p-6 rounded-[2rem] glass border border-border/10 flex flex-col gap-4 shadow-xl hover:border-primary/40 hover:shadow-primary/5 transition-all duration-300">
                  <div className="flex items-center gap-3 border-b border-border/10 pb-4">
                    <div className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">RES</div>
                    <span className="text-lg font-black">{resolution}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {links.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-muted/50 hover:bg-primary/20 hover:text-primary border border-border/20 rounded-xl text-xs font-bold transition-colors"
                      >
                        {link.server}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
