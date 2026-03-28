import Link from "next/link"
import { GlitchText } from "@/components/ui/glitch-text"
import { FEATURED_PROJECTS } from "@/lib/data/projects"

export function Projects() {
  return (
    <section className="py-24 md:py-40 lg:py-56 px-6 bg-accent/[0.02] relative">
      <div className="max-w-7xl mx-auto space-y-20 md:space-y-32">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-4 px-5 py-1.5 rounded-full glass border border-border/20 text-[9px] font-black uppercase tracking-[0.6em] text-primary mb-6 shadow-2xl">
            Showcase
          </div>
          <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
            Featured <GlitchText text="Projects" className="text-primary" />
          </h2>
          <div className="h-2 w-48 bg-gradient-to-r from-primary via-accent to-primary mx-auto rounded-full shadow-glow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {FEATURED_PROJECTS.map((project, i) => (
            <div key={i} className="group relative">
              <div className="absolute -inset-px rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-br from-primary/40 via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />
              <div className="relative glass-card rounded-[2.5rem] md:rounded-[3rem] border border-border/10 group-hover:border-primary/50 transition-all duration-700 overflow-hidden flex flex-col h-full">
                <div className="relative h-52 md:h-60 overflow-hidden">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-black uppercase tracking-[0.35em] text-primary">
                    {project.id}
                  </span>
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-[9px] font-black uppercase tracking-[0.3em] text-primary">
                    {project.category}
                  </span>
                </div>
                <div className="p-5 md:p-10 flex flex-col gap-4 md:gap-5 flex-1">
                  <div className="space-y-2">
                    <h3 className={`text-xl md:text-3xl font-black italic uppercase tracking-tighter leading-tight group-hover:${project.colorClass} transition-colors duration-500`}>
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground/80 text-xs md:text-sm font-medium leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-muted/40 border border-border/20 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-border/10">
                    <Link href={project.link} className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] ${project.colorClass} group-hover: gap-4 transition-all duration-500`}>
                      View Project
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/project" className="inline-flex items-center gap-4 px-10 md:px-12 py-5 md:py-6 rounded-full glass border border-border/20 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-muted font-display hover:border-primary/40 transition-all">
            Explore Full Archive
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
