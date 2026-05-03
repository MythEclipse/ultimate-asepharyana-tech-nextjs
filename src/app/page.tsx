"use client";

import {
  IconCode,
  IconCpu,
  IconDatabase,
  IconGlobe,
  IconArrowRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandInstagram,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { NoSSR } from "@/components/ui/no-ssr";
import { Section } from "@/components/ui/section";
import githubStats from "@/lib/data/github-stats.json";
import { useGitHubStats } from "@/lib/hooks/use-github-stats";

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      vx: number;
      vy: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(
        100,
        Math.floor((window.innerWidth * window.innerHeight) / 15000)
      );
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2,
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 51, 102, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />;
};

const FloatingStar = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, rot: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth) * 2 - 1) * 8;
      const y = ((e.clientY / window.innerHeight) * 2 - 1) * 8;
      const rot = x * 2;
      setPosition({ x, y, rot });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      className="fixed bottom-20 right-20 w-12 h-12 z-50 pointer-events-none transition-transform duration-300"
      style={{ transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rot}deg)` }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M12 2L15 8L22 9L17 14L18 21L12 17.5L6 21L7 14L2 9L9 8L12 2Z"
          fill="#ff3366"
          stroke="#fff"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

interface TechIcon {
  name: string;
  image: string;
  color: string;
  description: string;
}

const TECH_STACK: TechIcon[] = [
  { name: "TypeScript", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", color: "from-blue-500 to-blue-600", description: "Type-safe architecture for reliable large-scale applications." },
  { name: "Rust", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg", color: "from-orange-500 to-red-600", description: "Memory-safe system programming with high performance." },
  { name: "Kotlin", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg", color: "from-blue-500 to-blue-600", description: "Modern JVM language for Android and backend development." },
  { name: "JavaScript", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "from-yellow-400 to-yellow-600", description: "Versatile web scripting for dynamic client and server UI." },
  { name: "Java", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", color: "from-red-500 to-orange-500", description: "Enterprise-grade services and scalable microservices." },
  { name: "Python", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", color: "from-green-500 to-blue-500", description: "Productivity scripting and data-driven AI integration." },
];

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

function HeroSection() {
  const totalContributions = githubStats.totalContributions ?? githubStats.contributions?.reduce((sum, item) => sum + item.count, 0) ?? 0;

  return (
    <section className="pb-20 pt-36 min-h-[90vh] w-full flex flex-col items-center justify-center relative transition-all duration-700">
      <div className="flex justify-center relative my-20 z-10 w-full text-center px-4 sm:px-6">
        <div className="max-w-xl sm:max-w-4xl flex flex-col items-center">
          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[0.95] tracking-tightest mb-8 text-foreground text-balance">
            Web Portfolio Asep Haryana Saputra<br />
            <span className="gradient-text">Aktif di GitHub dengan {totalContributions.toLocaleString()} kontribusi</span>
          </h1>
          <p className="max-w-2xl text-muted-foreground text-lg md:text-xl lg:text-2xl mb-12 font-medium leading-relaxed">
            Halo, saya <span className="text-foreground border-b-2 border-primary/30 font-bold">Asep Haryana Saputra</span>. Saya membuat proyek dengan React, Tailwind, dan Next.js untuk mengasah kemampuan frontend dan memperlihatkan hasil kerja.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Button href="/project" size="xl" variant="shiny" className="shadow-2xl shadow-primary/20">
              View Portfolio <IconArrowRight className="ml-2" />
            </Button>
            <Button href="mailto:superaseph@gmail.com" size="xl" variant="outline" className="glass border-hairline hover:bg-foreground/5">
              Get in Touch
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Scroll</span>
        <div className="w-px h-12 bg-linear-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}

function TechArsenal() {
  return (
    <Section className="py-24 w-full" glow>
      <div className="mb-16 text-center lg:text-left">
        <Badge variant="glass" className="mb-4">Capabilities</Badge>
        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">Beginner <span className="text-foreground">Tech Stack</span></h2>
        <p className="text-muted-foreground mt-4 max-w-xl text-lg mx-auto lg:mx-0">Core tools and frameworks I am currently exploring in practice projects (React, Tailwind, Next.js).</p>
      </div>

      <div className="grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {TECH_STACK.slice(0, 6).map((item, index) => (
          <div key={item.name} className={"row-span-1 rounded-xl group/bento hover:shadow-lg hover:shadow-primary/5 transition duration-300 p-4 bg-card border border-border/10 dark:border-white/5 justify-between flex flex-col space-y-3 hover:border-primary/30 hover:-translate-y-0.5 " + (index === 0 || index === 3 ? "md:col-span-2" : "")}>
            <div className="group/header h-full min-h-36 rounded-lg glass border-hairline/50 flex items-center justify-center p-6 transition-all hover:bg-foreground/5 overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity" />
              <Image src={item.image} alt={item.name} width={56} height={56} className="w-14 h-14 object-contain filter drop-shadow-2xl group-hover:scale-125 transition-transform duration-500" />
            </div>
            <div className="group-hover/bento:translate-x-2 transition duration-200">
              <div className="font-sans font-bold text-foreground mb-2 mt-2">{item.name}</div>
              <div className="font-sans font-normal text-muted-foreground text-xs">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ActivitySection() {
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

function CallToActionSection() {
  return (
    <section className="w-full py-48 relative flex flex-col items-center justify-center text-center px-4 transition-all duration-500">
      <div className="absolute inset-0 bg-primary/20 blur-[160px] rounded-full mx-auto w-1/2 h-1/2 -z-10 animate-pulse-slow" />

      <h2 className="text-[clamp(2rem,10vw,6rem)] font-black text-foreground mb-12 leading-[0.9] tracking-tightest uppercase text-balance">
        Build projects together <br /> <span className="text-primary">and learn step-by-step</span>
      </h2>

      <p className="text-muted-foreground mb-12 max-w-2xl text-xl font-medium leading-relaxed">
        Sharing beginner-friendly projects with clear structure to show growth in web development skills.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        <Button href="mailto:superaseph@gmail.com" size="xl" variant="shiny" className="shadow-2xl shadow-primary/40">
          Initiate Project <IconArrowRight className="ml-2" />
        </Button>

        <div className="flex items-center gap-4">
          {[
            { href: "https://github.com/MythEclipse", icon: IconBrandGithub, label: "GitHub" },
            { href: "https://linkedin.com", icon: IconBrandLinkedin, label: "LinkedIn" },
            { href: "https://instagram.com", icon: IconBrandInstagram, label: "Instagram" },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 glass rounded-lg flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all hover:-translate-y-1 border-hairline/50"
              aria-label={`Visit ${label}`}
            >
              <Icon size={24} className="text-foreground" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const navItems = [
    { name: "Home", link: "/", icon: <IconCode className="h-4 w-4" /> },
    { name: "Projects", link: "/project", icon: <IconGlobe className="h-4 w-4" /> },
    { name: "Anime", link: "/anime", icon: <IconCpu className="h-4 w-4" /> },
    { name: "Dashboard", link: "/dashboard", icon: <IconDatabase className="h-4 w-4" /> },
  ];

  return (
    <>
      <ParticleBackground />
      <FloatingStar />
      <FloatingNav navItems={navItems} />
      <HeroSection />
      <TechArsenal />
      <ActivitySection />
      <CallToActionSection />
    </>
  );
}
