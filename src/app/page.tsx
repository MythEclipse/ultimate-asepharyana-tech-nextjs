"use client"

import React from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"

// Aceternity & shadcn Components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { SparklesCore } from "@/components/ui/sparkles"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { Section } from "@/components/ui/section"

// Icons
import { 
  IconArrowRight, 
  IconBrandGithub, 
  IconBrandLinkedin, 
  IconBrandInstagram,
  IconCode,
  IconCpu,
  IconDatabase,
  IconGlobe
} from "@tabler/icons-react"

// Data
import { TECH_STACK } from "@/lib/data/tech-icons"
import { type GitHubStatsResponse } from "@/lib/api/github"

// Dynamic D3 Charts
const SkillsRadarChart = dynamic(
  () => import("@/components/d3/skills-radar-chart").then((m) => m.SkillsRadarChart),
  { ssr: false, loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-3xl" /> }
)
const ActivityHeatmap = dynamic(
  () => import("@/components/d3/activity-heatmap").then((m) => m.ActivityHeatmap),
  { ssr: false, loading: () => <div className="h-[200px] w-full bg-muted animate-pulse rounded-3xl" /> }
)

export default function Home() {
  const { data: githubStats, isLoading: isStatsLoading } = useQuery<GitHubStatsResponse>({
    queryKey: ["github-stats"],
    queryFn: async () => {
      const res = await fetch("/api/github/stats")
      if (!res.ok) throw new Error("Failed to fetch GitHub stats")
      return res.json()
    },
    staleTime: 1000 * 60 * 30,
  })

  const navItems = [
    { name: "Home", link: "/", icon: <IconCode className="h-4 w-4" /> },
    { name: "Projects", link: "/project", icon: <IconGlobe className="h-4 w-4" /> },
    { name: "Anime", link: "/anime", icon: <IconCpu className="h-4 w-4" /> },
    { name: "Dashboard", link: "/dashboard", icon: <IconDatabase className="h-4 w-4" /> },
  ]

  return (
    <main className="relative bg-background flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5 transition-colors duration-500">
      <FloatingNav navItems={navItems} />
      
      {/* 1. HERO SECTION */}
      <div className="pb-20 pt-36 min-h-screen w-full flex flex-col items-center justify-center relative">
        <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="var(--color-primary)" />
        <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="var(--color-accent)" />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="var(--color-secondary)" />

        <div className="h-full w-full bg-background dark:bg-grid-white/[0.03] bg-grid-black/[0.02] absolute top-0 left-0 flex items-center justify-center transition-colors duration-500">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </div>

        <div className="flex justify-center relative my-20 z-10">
          <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
            <Badge variant="glass" className="uppercase tracking-widest text-xs text-primary max-w-80">
              Modern Digital Infrastructure
            </Badge>

            <div className="text-center text-[40px] md:text-5xl lg:text-6xl font-black mt-8 leading-tight tracking-tighter text-foreground">
              Transforming Concepts into <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">Immersive Digital Reality</span>
            </div>

            <p className="text-center md:tracking-wider mb-8 text-sm md:text-lg lg:text-2xl text-muted-foreground mt-6 max-w-3xl">
              Hi, I&apos;m <span className="text-foreground font-bold">Asep Haryana Saputra</span>, a Fullstack Developer specializing in high-fidelity user experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mt-10">
              <Button href="/project" size="xl" variant="premium">
                Explore My Work <IconArrowRight className="ml-2" />
              </Button>
              <Button href="mailto:superaseph@gmail.com" size="xl" variant="outline" className="rounded-2xl border-border hover:bg-accent/5 transition-all">
                Let&apos;s Connect
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ARSENAL (BENTO GRID) */}
      <Section className="py-20 w-full" glow>
        <div className="w-full flex flex-col items-center mb-20 text-center">
          <Badge className="mb-4">Portfolio Highlights</Badge>
          <h2 className="text-4xl md:text-6xl font-black text-foreground">
            Technical <span className="text-primary">Arsenal</span>
          </h2>
          <div className="h-1 w-24 bg-primary mt-4 rounded-full" />
        </div>

        <BentoGrid className="max-w-7xl mx-auto px-4 md:px-0">
          {TECH_STACK.slice(0, 6).map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.name}
              description={`Expertise in building scalable systems with ${item.name}.`}
              header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-muted dark:from-neutral-900 dark:to-neutral-800 to-accent/5 flex items-center justify-center">
                <Image src={item.image} alt={item.name} width={48} height={48} className="w-12 h-12 object-contain grayscale-0 group-hover:scale-110 transition-transform" />
              </div>}
              icon={<IconCode className="h-4 w-4 text-muted-foreground" />}
              className={i === 3 || i === 0 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </Section>

      {/* 3. SKILLS & ACTIVITY */}
      <Section className="py-20 w-full relative">
         <div className="w-full flex flex-col items-center mb-20 relative text-center">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full absolute top-0 left-0 -z-10"
            particleColor="var(--color-primary)"
          />
          <Badge className="mb-4">Realtime Metrics</Badge>
          <h2 className="text-4xl md:text-6xl font-black text-foreground">
            Professional <span className="text-primary">Stamina</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto px-4 md:px-0">
          <Card className="p-8 bg-card border-border">
             <div className="mb-8">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Radar Map</span>
                <h3 className="text-2xl font-bold text-foreground mt-1">Core Competency</h3>
             </div>
             <div className="min-h-[400px] flex items-center justify-center">
               {isStatsLoading ? <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" /> : <SkillsRadarChart data={githubStats?.languages || []} />}
             </div>
          </Card>

          <Card className="p-8 bg-card border-border">
             <div className="mb-8">
                <span className="text-xs font-black uppercase tracking-widest text-primary">History</span>
                <h3 className="text-2xl font-bold text-foreground mt-1">Contribution Pulse</h3>
             </div>
             <div className="min-h-[400px] overflow-hidden">
               {isStatsLoading ? <div className="space-y-4">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-2 bg-muted rounded-full" />)}</div> : <ActivityHeatmap data={githubStats?.contributions || []} />}
             </div>
          </Card>
        </div>
      </Section>

      {/* 4. CONTACT */}
      <div className="w-full py-40 relative flex flex-col items-center justify-center px-4">
        <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full mx-auto w-1/2 h-1/2 -z-10" />
        
        <h2 className="text-4xl md:text-7xl font-black text-foreground text-center mb-10 leading-none tracking-tighter">
          READY TO ELEVATE <br /> <span className="text-primary shadow-primary/20">YOUR DIGITAL PRESENCE?</span>
        </h2>
        
        <p className="text-muted-foreground text-center mb-10 max-w-xl text-lg">
          Let&apos;s collaborate on your next groundbreaking project. Reach out today for a technical consultation.
        </p>

        <div className="flex items-center gap-6 mt-10">
          <a href="https://github.com/MythEclipse" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all hover:-translate-y-1">
            <IconBrandGithub size={24} className="text-foreground" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all hover:-translate-y-1">
            <IconBrandLinkedin size={24} className="text-foreground" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all hover:-translate-y-1">
            <IconBrandInstagram size={24} className="text-foreground" />
          </a>
        </div>
      </div>

    </main>
  )
}
