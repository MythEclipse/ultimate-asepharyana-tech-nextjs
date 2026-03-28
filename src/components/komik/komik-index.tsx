import { fetchManga, fetchManhwa, fetchManhua } from "@/lib/api/komik";
import { GlitchText } from "@/components/ui/glitch-text";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { MangaItem } from "@/lib/api/komik";

function SectionHeader({ title, icon, gradient }: { title: string, icon: string, gradient: string }) {
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
          </div>
        </div>
      </div>
    </div>
  );
}

function KomikCard({ item, index }: { item: MangaItem, index: number }) {
  const delayStyle = { animationDelay: `${index * 50}ms` };
  
  return (
    <div className="group animate-slide-up opacity-0 fill-mode-forwards" style={delayStyle}>
      <Link href={`/komik/detail/${item.slug}`} className="block relative group/card perspective-1000">
        <div className="relative aspect-[3/4.2] rounded-[2rem] overflow-hidden bg-muted border border-border/50 shadow-2xl transition-all duration-700 hover-tilt group-hover:shadow-orange-500/20 group-hover:border-orange-500/40">
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
            {item.score && (
              <div className="glass-subtle px-3 py-1.5 rounded-xl border border-border/20 text-xs font-black text-yellow-500 flex items-center gap-1.5 shadow-2xl">
                ⭐ {item.score}
              </div>
            )}
            <div className="glass-subtle px-3 py-1.5 rounded-xl border border-border/20 text-[10px] font-black uppercase tracking-widest text-foreground/90 shadow-2xl">
              {item.type}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-orange-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              {item.chapter}
            </div>
            <h3 className="text-lg font-black text-foreground leading-tight line-clamp-2 [text-shadow:0_4px_12px_rgba(0,0,0,0.5)] group-hover:text-orange-400 transition-colors">
              {item.title}
            </h3>
          </div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-orange-500/10 via-transparent to-red-500/10 transition-opacity duration-500 pointer-events-none" />
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-orange-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>
    </div>
  );
}

function KomikGrid({ items }: { items: MangaItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
      {items.map((item, i) => (
        <KomikCard key={item.slug || i} item={item} index={i} />
      ))}
    </div>
  );
}

async function KomikIndexContent() {
  let manga, manhwa, manhua;
  try {
    [manga, manhwa, manhua] = await Promise.all([
      fetchManga(1),
      fetchManhwa(1),
      fetchManhua(1)
    ]);
  } catch {
    return (
      <div className="glass-card p-12 rounded-[2rem] text-center border border-red-500/20">
        <div className="text-4xl mb-4">❌</div>
        <h3 className="text-xl font-black uppercase italic">Connection Error</h3>
        <p className="text-muted-foreground">Unable to load comic database. Please try again later.</p>
      </div>
    );
  }
    
  return (
    <div className="space-y-32">
      <section>
        <SectionHeader title="Manga (JP)" icon="⛩️" gradient="from-orange-600 to-red-700" />
        <KomikGrid items={manga.data.slice(0, 12)} />
      </section>
      <section>
        <SectionHeader title="Manhwa (KR)" icon="💎" gradient="from-blue-600 to-cyan-700" />
        <KomikGrid items={manhwa.data.slice(0, 12)} />
      </section>
      <section>
        <SectionHeader title="Manhua (CN)" icon="🐉" gradient="from-emerald-600 to-teal-700" />
        <KomikGrid items={manhua.data.slice(0, 12)} />
      </section>
    </div>
  );
}

export default function KomikIndexPage() {
  return (
    <main className="min-h-screen py-24 px-6 md:px-12 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto space-y-32">
        <header className="text-center space-y-12 animate-fade-in">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-border/10 shadow-2xl">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Reading Library</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[1.1] mt-4">
              <GlitchText 
                  text="Komik" 
                  className="bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] pb-2"
              />
              <span className="text-foreground/20 block translate-y-[-0.5em] scale-y-75 uppercase">Index</span>
            </h1>
          </div>
        </header>

        <Suspense fallback={
          <div className="w-full flex justify-center py-20">
             <div className="w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
          </div>
        }>
          <KomikIndexContent />
        </Suspense>
      </div>
    </main>
  );
}
