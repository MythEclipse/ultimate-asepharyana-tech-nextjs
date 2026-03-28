"use client"

import { FEATURED_PROJECTS } from "@/lib/data/projects"
import { useIsMounted } from "@/lib/hooks/use-mounted"
import { GlitchText } from "@/components/ui/glitch-text"
import Link from "next/link"

function CardSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-white/5 animate-pulse border border-white/5 flex flex-col overflow-hidden h-[400px]">
      <div className="h-52 bg-white/10 shrink-0" />
      <div className="p-6 space-y-3 flex-1 flex flex-col">
        <div className="h-7 w-3/4 bg-white/10 rounded-lg" />
        <div className="h-4 w-full bg-white/5 rounded-lg" />
        <div className="h-4 w-5/6 bg-white/5 rounded-lg" />
        <div className="h-4 w-2/3 bg-white/5 rounded-lg mt-auto" />
      </div>
    </div>
  )
}

export default function ProjectPage() {
  const mounted = useIsMounted()

  return (
    <main className="min-h-screen relative overflow-hidden pb-40">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[8%] left-[4%] w-[36rem] h-[36rem] bg-cyan-500/6 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute top-[55%] right-[4%] w-[32rem] h-[32rem] bg-purple-500/6 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: "-5s" }} />
        <div className="absolute top-[35%] left-[40%] w-[24rem] h-[24rem] bg-blue-500/6 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "-2.5s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        {/* Header */}
        <header className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/5 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Data Archive · Selected Works
          </div>

          <div className="space-y-2">
            <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter uppercase leading-[0.9] text-center">
              <GlitchText
                  text="Project"
                  className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              />
            </h1>
            <p className="text-3xl md:text-4xl font-black uppercase tracking-[0.3em] text-foreground/10 text-center">
              Showcase
            </p>
          </div>

          <p className="max-w-xl text-muted-foreground/60 text-base font-medium leading-relaxed">
            A curated collection of software engineering projects built with 
            <span className="text-cyan-400 font-bold"> Rust </span>
            and modern <span className="text-purple-400 font-bold"> Frontend </span>
            technologies.
          </p>

          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.35em] text-muted-foreground/40">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-border/50" />
            Total
            <span className="text-foreground/80 px-3 py-1 bg-muted/50 rounded-md border border-border/50">{FEATURED_PROJECTS.length}</span>
            Projects
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border/50" />
          </div>
        </header>

        {/* Grid */}
        {!mounted ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
            <CardSkeleton /> <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [&>*]:h-full">
            {FEATURED_PROJECTS.map((project, i) => {
              const isExternal = project.link.startsWith("http")
              const delay = `${i * 120}ms`

              const inner = (
                <>
                  <div className="absolute -inset-px bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-purple-500/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />

                  <article className="relative flex flex-col h-full bg-card/70 rounded-2xl overflow-hidden border border-white/8 shadow-2xl transition-all duration-500 hover:-translate-y-1 group-hover:border-cyan-500/40 backdrop-blur-sm">
                    {/* Image */}
                    <div className="relative h-52 shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/30 to-transparent pointer-events-none" />

                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/50 backdrop-blur-md border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary">
                        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                        {project.category}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-6 gap-4">
                      <div className="flex flex-col gap-1.5 flex-1">
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground group-hover:text-cyan-300 transition-colors duration-300 chromatic-hover">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground/70 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="relative flex items-center gap-2 pt-4 border-t border-white/8 mt-auto">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 group-hover:text-cyan-400 transition-colors">
                            {isExternal ? "View Docs" : "Explore"}
                        </span>
                        <svg className="w-4 h-4 text-primary transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </article>
                </>
              )

              if (isExternal) {
                return (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="relative block h-full group animate-slide-up" style={{ animationDelay: delay }} key={i}>
                    {inner}
                  </a>
                )
              }

              return (
                <Link href={project.link} className="relative block h-full group animate-slide-up" style={{ animationDelay: delay }} key={i}>
                  {inner}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
