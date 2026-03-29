"use client"

import { motion } from "framer-motion"
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

import { NoSSR } from "@/components/ui/no-ssr"

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
    <main className="relative flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <FloatingNav navItems={navItems} />
      
      {/* 1. HERO SECTION */}
      <section className="pb-20 pt-36 min-h-[90vh] w-full flex flex-col items-center justify-center relative">
        <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="var(--color-primary)" />
        <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="var(--color-accent)" />

        <div className="flex justify-center relative my-20 z-10 w-full text-center">
          <div className="max-w-[89vw] md:max-w-4xl flex flex-col items-center">
            <Badge variant="glow" className="mb-8 px-4 py-1.5 uppercase tracking-[0.3em] font-black">
              Engineering Excellence
            </Badge>

            <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[0.95] tracking-tightest mb-8 text-foreground text-balance">
              Building the Future of <br />
              <span className="text-gradient">Digital Architecture</span>
            </h1>

            <p className="max-w-2xl text-muted-foreground text-lg md:text-xl lg:text-2xl mb-12 font-medium leading-relaxed">
              I&apos;m <span className="text-foreground border-b-2 border-primary/30">Asep Haryana Saputra</span>, craftmanship in Backend systems & high-performance Frontend engineering.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button href="/project" size="xl" variant="shiny" className="shadow-2xl shadow-primary/20">
                View Portfolio <IconArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button href="mailto:superaseph@gmail.com" size="xl" variant="outline" className="glass border-hairline hover:bg-foreground/5">
                Get in Touch
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* 2. ARSENAL (BENTO GRID) */}
      <Section className="py-24 w-full" glow>
        <div className="max-w-7xl mx-auto w-full mb-16 text-center lg:text-left">
          <Badge variant="glass" className="mb-4">Capabilities</Badge>
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
            Technical <span className="text-primary">Arsenal</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg lg:ml-0 mx-auto">
            A curated stack for building scalable, high-performance applications from the ground up.
          </p>
        </div>

        <BentoGrid className="max-w-7xl mx-auto">
          {TECH_STACK.slice(0, 6).map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.name}
              description={`Precision engineering using ${item.name} for enterprise-grade solutions.`}
              header={
                <div className="group/header h-full w-full min-h-[10rem] rounded-2xl glass border-hairline flex items-center justify-center p-8 transition-all hover:bg-foreground/5 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity" />
                   <Image 
                    src={item.image} 
                    alt={item.name} 
                    width={56} 
                    height={56} 
                    className="w-14 h-14 object-contain filter drop-shadow-2xl group-hover:scale-125 transition-transform duration-500" 
                  />
                </div>
              }
              className={i === 3 || i === 0 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </Section>

      {/* 3. SKILLS & ACTIVITY */}
      <Section className="py-24 w-full relative">
         <div className="w-full flex flex-col items-center mb-24 relative text-center">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={800}
            className="w-full h-full absolute top-0 left-0 -z-10"
            particleColor="var(--color-primary)"
          />
          <Badge variant="glow" className="mb-4">Activity Matrix</Badge>
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
            Operational <span className="text-primary">Cadence</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
          <Card className="p-8">
             <div className="mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Intelligence Radar</span>
                <h3 className="text-3xl font-black text-foreground mt-2 tracking-tight">Core Expertise</h3>
             </div>
             <div className="min-h-[400px] flex flex-col items-center justify-center">
               <NoSSR fallback={<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />}>
                 {isStatsLoading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
                 ) : githubStats?.languages?.length ? (
                    <SkillsRadarChart data={githubStats.languages} />
                 ) : (
                    <div className="text-center space-y-2">
                      <p className="text-muted-foreground text-sm font-medium italic">
                        {githubStats?.error?.includes("Rate Limit") 
                          ? "GitHub Public Rate Limit Exceeded" 
                          : "Live statistics currently unavailable"}
                      </p>
                      <Badge variant="outline" className="text-[10px] opacity-50">Public API Fallback Active</Badge>
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
             <div className="min-h-[400px] flex flex-col items-center justify-center">
               <NoSSR fallback={<div className="space-y-4 w-full px-10"><div className="h-2 bg-muted rounded-full animate-pulse" /></div>}>
                 {isStatsLoading ? (
                    <div className="space-y-4 w-full px-10">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-2 bg-muted rounded-full animate-pulse" />
                      ))}
                    </div>
                 ) : githubStats?.contributions?.length ? (
                    <div className="w-full">
                      <ActivityHeatmap data={githubStats.contributions} />
                    </div>
                 ) : (
                    <div className="text-center space-y-2">
                      <p className="text-muted-foreground text-sm font-medium italic">
                         No contribution data detected in public manifest
                      </p>
                      <Badge variant="outline" className="text-[10px] opacity-50">1-Year Scraper Syncing...</Badge>
                    </div>
                 )}
               </NoSSR>
             </div>
          </Card>
        </div>
      </Section>

      {/* 4. CALL TO ACTION */}
      <section className="w-full py-48 relative flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-primary/20 blur-[160px] rounded-full mx-auto w-1/2 h-1/2 -z-10 animate-pulse-slow" />
        
        <h2 className="text-[clamp(2rem,10vw,6rem)] font-black text-foreground mb-12 leading-[0.9] tracking-tightest uppercase text-balance">
          Ready to Forge the <br /> <span className="text-gradient">Next Generation?</span>
        </h2>
        
        <p className="text-muted-foreground mb-12 max-w-2xl text-xl font-medium leading-relaxed">
          I am currently available for high-impact projects and technical collaborations. Let&apos;s build something extraordinary together.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
           <Button href="mailto:superaseph@gmail.com" size="xl" variant="shiny" className="shadow-2xl shadow-primary/40">
              Initiate Project <IconArrowRight className="ml-2" />
           </Button>
           
           <div className="flex items-center gap-4">
            <a href="https://github.com/MythEclipse" target="_blank" rel="noopener noreferrer" className="w-14 h-14 glass rounded-2xl flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all hover:-translate-y-2 border-hairline">
              <IconBrandGithub size={24} className="text-foreground" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-14 h-14 glass rounded-2xl flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all hover:-translate-y-2 border-hairline">
              <IconBrandLinkedin size={24} className="text-foreground" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-14 h-14 glass rounded-2xl flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all hover:-translate-y-2 border-hairline">
              <IconBrandInstagram size={24} className="text-foreground" />
            </a>
           </div>
        </div>
      </section>
    </main>
  )
}
