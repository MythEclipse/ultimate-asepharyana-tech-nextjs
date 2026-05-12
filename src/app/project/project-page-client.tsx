"use client"

import { ContentGrid } from "@/components/layout/content-grid"
import { FeatureCard } from "@/components/layout/feature-card"
import { PageHero } from "@/components/layout/page-hero"
import { PageShell } from "@/components/layout/page-shell"
import { FEATURED_PROJECTS, MEDIA_PROJECTS } from "@/lib/data/projects"

export function ProjectPageClient() {
  return (
    <PageShell contentClassName="max-w-6xl">
      <PageHero
        badge="Featured Projects"
        title="Project"
        kicker="Showcase"
        description={
          <>
            Software projects built with <span className="text-cyan-400 font-bold">Rust</span> and{" "}
            <span className="text-blue-400 font-bold">Frontend</span> technologies.
          </>
        }
        meta={
          <>
            <span className="h-px w-16 bg-linear-to-r from-transparent to-border/50" />
            Total
            <span className="text-foreground/80 px-3 py-1 bg-muted/50 rounded-md border border-border/50">
              {FEATURED_PROJECTS.length}
            </span>
            Projects
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-border/50" />
          </>
        }
      />

      <div className="mb-20">
        <ContentGrid>
          {MEDIA_PROJECTS.map((project) => (
            <FeatureCard
              key={project.id}
              title={project.title}
              description={project.description}
              category={project.category}
              image={project.image}
              href={project.link}
              actionLabel="Open"
            />
          ))}
        </ContentGrid>
      </div>

      <ContentGrid>
        {FEATURED_PROJECTS.map((project) => (
          <FeatureCard
            key={project.id}
            title={project.title}
            description={project.description}
            category={project.category}
            image={project.image}
            href={project.link}
            actionLabel={project.link.startsWith("http") ? "Visit" : "View"}
          />
        ))}
      </ContentGrid>
    </PageShell>
  )
}
