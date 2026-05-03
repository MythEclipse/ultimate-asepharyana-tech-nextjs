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
    <main className="min-h-screen text-foreground relative overflow-hidden transition-colors duration-500">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} interactive={false} className="h-[380px]">
                <Skeleton className="h-44 w-full rounded-xl mb-4" />
                <Skeleton className="h-7 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_PROJECTS.map((project, i) => {
              const isExternal = project.link.startsWith("http")
              const delay = `${i * 100}ms`

              return (
                <Link 
                    key={i}
                    href={project.link} 
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="group animate-slide-up"
                    style={{ animationDelay: delay }}
                >
                  <Card className="group-hover:border-primary/60 h-full flex flex-col overflow-hidden !bg-card/60 !backdrop-blur-md border-border/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/15 hover:-translate-y-1">
                    <div className="relative h-44 overflow-hidden">
                      <CachedImage
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/90">
                          {project.category}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-4 gap-2">
                      <Heading as="h3" className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
                        {project.title}
                      </Heading>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-2">
                        {project.description}
                      </p>

                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 group-hover:text-primary/80 transition-colors">
                            {isExternal ? "Visit" : "View"}
                          </span>
                          <svg className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
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