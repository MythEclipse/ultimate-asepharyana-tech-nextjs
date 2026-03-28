import { fetchAnime1Index, fetchAnime2Index, Anime1OngoingItem, Anime2OngoingItem, Anime2CompleteItem, Anime1Data, Anime2Data } from "@/lib/api/anime";
import { GlitchText } from "@/components/ui/glitch-text";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
type AnimeItem = Anime1OngoingItem | Anime2OngoingItem | Anime2CompleteItem;
// Assuming you have a loading component, or you can build one later
// import { PageLoadingOverlay } from "@/components/ui/page-loading-overlay";

function SectionHeader({ title, icon, gradient, link, linkGradient }: { title: string, icon: string, gradient: string, link: string, linkGradient: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-slide-up fill-mode-forwards">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl shadow-2xl relative group overflow-hidden`}>
            <div className="absolute inset-0 bg-foreground/10 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full blur-2xl" />
            <span className="relative z-10">{icon}</span>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-foreground leading-none drop-shadow-2xl">
              {title}
            </h2>
            <div className={`h-2 w-24 bg-gradient-to-r ${linkGradient} rounded-full mt-3`} />
          </div>
        </div>
      </div>
      <Link href={link} className="group flex items-center gap-4 px-8 py-4 rounded-2xl glass border border-border/10 text-foreground font-black uppercase tracking-widest text-sm hover:border-border/40 transition-all hover:scale-105 active:scale-95">
        View Library
        <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    </div>
  );
}

function AnimeCard({ item, index, source }: { item: AnimeItem, index: number, source: 1 | 2 }) {
  const delayStyle = { animationDelay: `${index * 50}ms` };
  const hasEpisode = 'current_episode' in item && !!item.current_episode;
  const hasScore = 'score' in item && !!item.score;
  const hasCount = 'episode_count' in item && !!item.episode_count;
  const prefix = source === 2 ? "anime2" : "anime";

  return (
    <div className="group animate-slide-up opacity-0 fill-mode-forwards" style={delayStyle}>
      <Link href={`/${prefix}/detail/${item.slug}`} className="block relative group/card perspective-1000">
        <div className="relative aspect-[3/4.2] rounded-[2rem] overflow-hidden bg-muted border border-border/50 shadow-2xl transition-all duration-700 hover-tilt group-hover:shadow-primary/20 group-hover:border-primary/40">
           {/* Replace CachedImage with a regular img for simplicity inside Server Components or a Client component Image wrapper */}
          <Image 
            src={item.poster} 
            alt={item.title} 
            width={300}
            height={420}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            {hasScore && (
              <div className="glass-subtle px-3 py-1.5 rounded-xl border border-border/20 text-xs font-black text-yellow-500 flex items-center gap-1.5 shadow-2xl">
                ⭐ {item.score}
              </div>
            )}
            {hasCount && (
              <div className="glass-subtle px-3 py-1.5 rounded-xl border border-border/20 text-[10px] font-black uppercase tracking-widest text-foreground/90 shadow-2xl">
                {item.episode_count} EPS
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            {hasEpisode && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {item.current_episode}
              </div>
            )}
            <h3 className="text-lg font-black text-foreground leading-tight line-clamp-2 [text-shadow:0_4px_12px_rgba(0,0,0,0.5)] group-hover:text-primary transition-colors">
              {item.title}
            </h3>
          </div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 transition-opacity duration-500 pointer-events-none" />
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>
    </div>
  );
}

function AnimeGrid({ items, source }: { items: AnimeItem[], source: 1 | 2 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
      {items.map((item, i) => (
        <AnimeCard key={item.slug || i} item={item} index={i} source={source} />
      ))}
    </div>
  );
}

// Data fetching wrapper
async function AnimeIndexContent({ source }: { source: 1 | 2 }) {
  let data: Anime1Data | Anime2Data;
  try {
    data = source === 2 ? await fetchAnime2Index() : await fetchAnime1Index();
  } catch {
    return (
      <div className="glass-card p-12 rounded-[2rem] text-center border border-red-500/20">
        <div className="text-4xl mb-4">❌</div>
        <h3 className="text-xl font-black uppercase italic">Connection Error</h3>
        <p className="text-muted-foreground">Unable to load anime database. Please try again later.</p>
      </div>
    );
  }

  const prefix = source === 2 ? "anime2" : "anime";
    
  return (
    <div className="space-y-32">
      <section>
        <SectionHeader
          title="Ongoing"
          icon="🔥"
          gradient="from-blue-600 to-indigo-700"
          link={`/${prefix}/ongoing-anime/1`}
          linkGradient="from-blue-500 to-indigo-500"
        />
        <AnimeGrid items={data.ongoing_anime} source={source} />
      </section>
      <section>
        <SectionHeader
          title="Complete"
          icon="✨"
          gradient="from-purple-600 to-pink-700"
          link={`/${prefix}/complete-anime/1`}
          linkGradient="from-purple-500 to-pink-500"
        />
        <AnimeGrid items={data.complete_anime} source={source} />
      </section>
    </div>
  );
}

export default function AnimeIndexPage({ source = 1 }: { source?: 1 | 2 }) {
  const sourceTitle = source === 2 ? "Source 2" : "Source 1";
  
  return (
    <main className="min-h-screen py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-32">
        <header className="text-center space-y-12 animate-fade-in">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-border/10 shadow-2xl">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Streaming Library ({sourceTitle})</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[1.1] mt-4">
              <GlitchText 
                  text="Anime" 
                  className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] pb-2"
              />
              <span className="text-foreground/20 block translate-y-[-0.5em] scale-y-75 uppercase">Hub</span>
            </h1>
          </div>

          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-[2.5rem] opacity-20 blur-2xl group-focus-within:opacity-50 transition-opacity duration-700" />
            <form action={`/anime${source === 2 ? '2' : ''}/search`} method="get" className="relative flex gap-4 p-2 rounded-[2.5rem] glass border border-border/20 shadow-2xl backdrop-blur-3xl">
              <input
                  type="text"
                  name="q"
                  placeholder="Search titles, genres, or studios..."
                  className="flex-1 bg-transparent px-8 py-5 focus:outline-none text-lg font-bold placeholder:text-muted-foreground/50 text-foreground"
              />
              <button
                  type="submit"
                  className="px-10 py-5 rounded-[2rem] bg-foreground text-background font-black uppercase tracking-widest hover:scale-95 transition-transform"
              >
                  Search
              </button>
            </form>
          </div>
        </header>

        <Suspense fallback={
          <div className="w-full flex justify-center py-20">
             <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        }>
          <AnimeIndexContent source={source} />
        </Suspense>
      </div>
    </main>
  );
}
