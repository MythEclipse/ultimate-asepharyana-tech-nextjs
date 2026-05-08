"use client";

import dynamic from "next/dynamic";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { NoSSR } from "@/components/ui/no-ssr";
import { Section } from "@/components/ui/section";
import { useGitHubStats } from "@/lib/hooks/use-github-stats";

const ActivityLoader = () => (
  <Card className="col-span-1 lg:col-span-2 w-full p-8 flex flex-col items-center justify-center min-h-90 border border-border/10 bg-background">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <p className="text-base font-medium text-foreground">Loading activity...</p>
    </div>
  </Card>
);

const ChartSkeleton = () => (
  <div className="h-100 w-full flex items-center justify-center opacity-50">
    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary/80 animate-spin" />
  </div>
);

const SkillsRadarChart = dynamic(
  () => import("@/components/d3/skills-radar-chart").then((mod) => mod.SkillsRadarChart),
  {
    ssr: false,
    loading: ChartSkeleton,
  }
);

const ActivityHeatmap = dynamic(
  () => import("@/components/d3/activity-heatmap").then((mod) => mod.ActivityHeatmap),
  {
    ssr: false,
    loading: ChartSkeleton,
  }
);

export function ActivitySection() {
  const { data, isLoading } = useGitHubStats();
  const contributions = data?.contributions ?? [];
  const languages = data?.languages ?? [];

  return (
    <Section className="py-24 w-full relative">
      <div className="w-full flex flex-col items-center mb-24 relative text-center">
        <Badge variant="glow" className="mb-4">Activity Matrix</Badge>
        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">Development <span className="text-foreground">Activity</span></h2>
      </div>

      <NoSSR fallback={<ActivityLoader />}>
        {isLoading ? (
          <ActivityLoader />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Card className="p-8">
              <div className="mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Intelligence Radar</span>
                <h3 className="text-3xl font-black text-foreground mt-2 tracking-tight">Core Expertise</h3>
              </div>
              <div className="min-h-100 w-full flex items-center justify-center">
                {languages.length ? <SkillsRadarChart data={languages} /> : (<div className="text-center space-y-2"><p className="text-muted-foreground text-sm font-medium italic">Live statistics currently unavailable. Please try again later.</p><Badge variant="outline" className="text-[10px] opacity-50">Public API Fallback Active</Badge></div>)}
              </div>
            </Card>

            <Card className="p-8">
              <div className="mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Development Pulse</span>
                <h3 className="text-3xl font-black text-foreground mt-2 tracking-tight">Technical Consistency</h3>
              </div>
              <div className="min-h-100 w-full flex items-center justify-center">
                {contributions.length ? <ActivityHeatmap data={contributions} /> : (<div className="text-center space-y-2"><p className="text-muted-foreground text-sm font-medium italic">No contribution data detected in public manifest.</p><Badge variant="outline" className="text-[10px] opacity-50">1-Year Scraper Syncing...</Badge></div>)}
              </div>
            </Card>
          </div>
        )}
      </NoSSR>
    </Section>
  );
}
