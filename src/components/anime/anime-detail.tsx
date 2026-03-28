import Link from "next/link";
import Image from "next/image";
import { GlitchText } from "@/components/ui/glitch-text";
import { AnimeDetailData } from "@/lib/api/anime";

interface AnimeDetailViewProps {
  data: AnimeDetailData;
  source: 1 | 2;
}

export function AnimeDetailView({ data, source }: AnimeDetailViewProps) {
  const prefix = source === 2 ? "anime2" : "anime";

  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Cinematic Header Background */}
      <div className="absolute top-0 left-0 w-full h-[60vh] md:h-[80vh] pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[100px] opacity-30"
          style={{ backgroundImage: `url(${data.poster})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 pt-32 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Metadata Sidebar */}
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
              <DetailRow label="Studio" value={data.studio} />
              <DetailRow label="Released" value={data.release_date} />
            </div>
          </div>

          {/* Core Information Panel */}
          <div className="flex-1 space-y-12">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter italic uppercase leading-tight drop-shadow-2xl">
                <GlitchText text={data.title} className="text-foreground" />
              </h1>
              {data.alternative_title && (
                <h2 className="text-xl md:text-2xl text-muted-foreground font-medium italic tracking-tight">
                  {data.alternative_title}
                </h2>
              )}
            </header>

            <div className="flex flex-wrap gap-3">
              {data.genres?.map((genre) => (
                <span 
                  key={genre.slug} 
                  className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-black uppercase tracking-widest text-foreground/80">Synopsis</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {data.synopsis}
              </p>
            </div>

            {/* Episodes Hub */}
            <div className="space-y-6 pt-8 border-t border-border/20">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black uppercase tracking-tight italic">Episodes</h3>
                <span className="text-sm font-black text-muted-foreground/50 tracking-widest">{data.episode_lists?.length || 0} Available</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40">
                {data.episode_lists?.map((ep) => (
                  <Link 
                    key={ep.slug} 
                    href={`/${prefix}/watch/${ep.slug}`}
                    className="group relative flex items-center justify-between p-4 rounded-2xl glass border border-border/10 hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 text-sm font-black text-foreground group-hover:text-primary transition-colors truncate pr-4">
                      {ep.episode}
                    </span>
                    <span className="relative z-10 w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border/20 group-hover:border-primary/40 group-hover:bg-primary/10 transition-colors shrink-0">
                      <svg className="w-4 h-4 text-foreground group-hover:text-primary translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
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
  if (!value || value === "Unknown" || value === "") return null;
  return (
    <div className="flex items-center justify-between py-1 border-b border-border/10 last:border-0">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>
      <span className="text-sm font-bold text-foreground truncate max-w-[150px] text-right" title={value}>{value}</span>
    </div>
  );
}
