import { GlitchText } from "@/components/ui/glitch-text"
import { CachedImage } from "@/components/ui/cached-image"
import { TECH_STACK } from "@/lib/data/tech-icons"

export function Arsenal() {
  return (
    <section className="py-24 md:py-40 lg:py-56 px-6 relative">
      <div className="max-w-7xl mx-auto space-y-20 md:space-y-32">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-4 px-5 py-1.5 rounded-full glass border border-white/10 text-[9px] font-black uppercase tracking-[0.6em] text-primary mb-6 shadow-2xl">
            Professional Background
          </div>
          <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
            Technical <GlitchText text="Stack" className="text-primary" />
          </h2>
          <div className="h-2 w-48 bg-gradient-to-r from-primary via-accent to-primary mx-auto rounded-full shadow-glow" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-8">
          {TECH_STACK.map((skill, i) => {
            const delay = `${100 * i}ms`
            return (
              <div key={i} className="group relative animate-slide-up opacity-0 fill-mode-forwards" style={{ animationDelay: delay }}>
                <div className="absolute -inset-2 bg-gradient-to-br from-primary to-accent rounded-[1.5rem] md:rounded-[3rem] opacity-0 group-hover:opacity-20 blur-3xl transition-all duration-1000" />
                <div className="relative glass-card h-full p-5 md:p-12 rounded-[1.5rem] md:rounded-[3rem] flex flex-col items-center justify-center gap-4 md:gap-8 border border-border/10 hover:border-primary/40 transition-all duration-700 hover:scale-[1.1] hover:-rotate-1 group shadow-xl backdrop-blur-3xl overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-16 md:w-24 h-16 md:h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                  <div className="w-12 h-12 md:w-20 md:h-20 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl scale-0 group-hover:scale-150 transition-transform duration-1000" />
                    <CachedImage 
                        src={skill.image} 
                        alt={skill.name} 
                        className="w-8 h-8 md:w-16 md:h-16 relative z-10 drop-shadow-2xl brightness-90 group-hover:brightness-110 transition-all filter group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" 
                    />
                  </div>
                  <div className="space-y-2 text-center">
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground group-hover:text-primary transition-colors block">
                        {skill.name}
                    </span>
                    <div className="h-0.5 w-6 bg-primary mx-auto scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
