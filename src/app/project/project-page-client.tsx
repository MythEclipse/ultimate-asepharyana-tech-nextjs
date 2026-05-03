"use client"

import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { CachedImage } from "@/components/ui/cached-image"
import { Card } from "@/components/ui/card"
import { GlitchText } from "@/components/ui/glitch-text"
import { Heading } from "@/components/ui/heading"
import { Section } from "@/components/ui/section"
import { Skeleton } from "@/components/ui/skeleton"
import { FEATURED_PROJECTS } from "@/lib/data/projects"
import { useIsMounted } from "@/lib/hooks/use-mounted"

export function ProjectPageClient() {
  const mounted = useIsMounted()

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-500">
      <Section glow glowVariant="both" className="pb-40 max-w-6xl mx-auto">
        <header className="flex flex-col items-center text-center space-y-8 mb-24">
          <Badge variant="glass">Featured Projects</Badge>

          <div className="space-y-2">
            <Heading as="h1" className="text-7xl md:text-[9rem]">
              <GlitchText
                  text="Project"
                  className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              />
            </Heading>
            <p className="text-3xl md:text-4xl font-black uppercase tracking-[0.3em] text-foreground/10 text-center">
              Showcase
            </p>
          </div>

          <p className="max-w-xl text-muted-foreground/60 text-base font-medium leading-relaxed">
            Software projects built with 
            <span className="text-cyan-400 font-bold"> Rust </span>
            and <span className="text-blue-400 font-bold"> Frontend </span>
            technologies.
          </p>

          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.35em] text-muted-foreground/40">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-border/50" />
            Total <span className="text-foreground/80 px-3 py-1 bg-muted/50 rounded-md border border-border/50">{FEATURED_PROJECTS.length}</span> Projects
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border/50" />
          </div>
        </header>

        {!mounted ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} interactive={false} className="h-[400px]">
                    <Skeleton className="h-52 w-full rounded-xl mb-6" />
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_PROJECTS.map((project, i) => {
              const isExternal = project.link.startsWith("http")
              const delay = `${i * 120}ms`

              return (
                <Link 
                    key={i}
                    href={project.link} 
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="group h-full animate-slide-up"
                    style={{ animationDelay: delay }}
                >
                  <Card className="h-full flex flex-col p-0 overflow-hidden bg-card/70 backdrop-blur-sm border-border/10 hover:border-cyan-500/40 transition-all duration-500">
                    <div className="relative h-52 shrink-0 overflow-hidden">
                      <CachedImage
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/30 to-transparent pointer-events-none" />

                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/50 backdrop-blur-md border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary">
                        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                        {project.category}
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-6 gap-4">
                      <div className="flex flex-col gap-1.5 flex-1">
                        <Heading as="h3" className="text-2xl group-hover:text-cyan-300 transition-colors chromatic-hover text-foreground">
                          {project.title}
                        </Heading>
                        <p className="text-sm text-muted-foreground/70 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="relative flex items-center gap-2 pt-4 border-t border-border/10 mt-auto">
                        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 group-hover:text-cyan-400 transition-colors">
                            {isExternal ? "Visit" : "View"}
                        </span>
                        <svg className="w-4 h-4 text-primary transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </Section>
    </main>
  )
}