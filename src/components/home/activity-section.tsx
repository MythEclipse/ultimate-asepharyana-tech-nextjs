"use client"

import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NoSSR } from "@/components/ui/no-ssr"
import { Section } from "@/components/ui/section"
import { useGitHubStats } from "@/lib/hooks/use-github-stats"

const SkillsRadarChart = dynamic(
  () => import("@/components/d3/skills-radar-chart").then((mod) => mod.SkillsRadarChart),
  {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-3xl" />,
  }
)

const ActivityHeatmap = dynamic(
  () => import("@/components/d3/activity-heatmap").then((mod) => mod.ActivityHeatmap),
  {
    ssr: false,
    loading: () => <div className="h-[200px] w-full bg-muted animate-pulse rounded-3xl" />,
  }
)

export function ActivitySection() {
  const { data, isLoading } = useGitHubStats()
  const contributions = data?.contributions ?? []
  const languages = data?.languages ?? []

  return (
    <Section className="py-24 w-full relative">
      <div className="w-full flex flex-col items-center mb-24 relative text-center">
        <Badge variant="glow" className="mb-4">
          Activity Matrix
        </Badge>
        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
          Operational <span className="text-primary">Cadence</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="p-8">
          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Intelligence Radar</span>
            <h3 className="text-3xl font-black text-foreground mt-2 tracking-tight">Core Expertise</h3>
          </div>

          <div className="min-h-[400px] flex items-center justify-center">
            <NoSSR fallback={<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />}> 
              {isLoading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
              ) : languages.length ? (
                <SkillsRadarChart data={languages} />
              ) : (
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground text-sm font-medium italic">
                    Live statistics currently unavailable. Please try again later.
                  </p>
                  <Badge variant="outline" className="text-[10px] opacity-50">
                    Public API Fallback Active
                  </Badge>
                </div>
              )}
            </NoSSR>
          </div>
        </Card>

        <Card className="p-8">
          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Development Pulse</span>
            <h3 className="text-3xl font-black text-foreground mt-2 tracking-tight">Technical Consistency</h3>
          </div>

          <div className="min-h-[400px] flex items-center justify-center">
            <NoSSR fallback={<div className="space-y-4 w-full px-10"><div className="h-2 bg-muted rounded-full animate-pulse" /></div>}>
              {isLoading ? (
                <div className="space-y-4 w-full px-10">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="h-2 bg-muted rounded-full animate-pulse" />
                  ))}
                </div>
              ) : contributions.length ? (
                <ActivityHeatmap data={contributions} />
              ) : (
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground text-sm font-medium italic">
                    No contribution data detected in public manifest.
                  </p>
                  <Badge variant="outline" className="text-[10px] opacity-50">
                    1-Year Scraper Syncing...
                  </Badge>
                </div>
              )}
            </NoSSR>
          </div>
        </Card>
      </div>
    </Section>
  )
}
