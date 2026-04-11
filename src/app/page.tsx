"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { NoSSR } from "@/components/ui/no-ssr";
import { Section } from "@/components/ui/section";
import { useGitHubStats } from "@/lib/hooks/use-github-stats";
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

const UnifiedActivityLoader = () => (
  <Card className="col-span-1 lg:col-span-2 w-full p-8 md:p-16 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden group border-primary/20">
    {/* Background Grid */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_80%)]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

    <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-24 opacity-80 group-hover:opacity-100 transition-opacity duration-1000">
      
      {/* Target Processing (Radar Node) */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-primary/30 animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-3 rounded-full border-t border-primary/60 animate-[spin_3s_linear_infinite_reverse]" />
        <div className="absolute inset-6 rounded-full border border-dashed border-primary/20 animate-[spin_10s_linear_infinite]" />
        <div className="w-4 h-4 bg-primary shadow-[0_0_20px_#ff3366] rounded-full animate-pulse" />
      </div>

      {/* Sync Beam */}
      <div className="hidden md:flex flex-col items-center gap-3 relative w-32">
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="w-16 h-[2px] bg-primary absolute top-1/2 -translate-y-1/2 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] shadow-[0_0_10px_#ff3366]" />
        <div className="relative z-10 bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full border border-primary/20 text-[10px] font-black tracking-[0.3em] uppercase text-primary">
          Linking Data
        </div>
      </div>

      {/* Grid Processing (Heatmap Nodes) */}
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 24 }).map((_, i) => {
          const isBlinking = i % 4 === 0;
          const isPrimary = i % 7 === 0;
          return (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-[2px] ${isPrimary ? 'bg-primary/80' : 'bg-primary/20'} ${isBlinking ? 'animate-pulse' : ''}`}
            />
          );
        })}
      </div>
    </div>

    <div className="mt-20 relative z-10 flex flex-col items-center">
      <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-primary to-transparent mb-4 opacity-50" />
      <span className="text-[10px] font-black tracking-[0.5em] text-foreground uppercase animate-pulse">
        Aggregating Global Activity Matrix...
      </span>
    </div>
  </Card>
);

const ChartSkeleton = () => (
  <div className="h-[400px] w-full flex items-center justify-center opacity-50">
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
  return (
    <section className="pb-20 pt-36 min-h-[90vh] w-full flex flex-col items-center justify-center relative transition-all duration-700">
      <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="var(--color-accent)" />

      <div className="flex justify-center relative my-20 z-10 w-full text-center">
        <div className="max-w-[89vw] md:max-w-4xl flex flex-col items-center">
          <div className="mb-8 px-4 py-1.5 uppercase tracking-[0.3em] font-black glass rounded-full shadow-sm">Software Engineering</div>
          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[0.95] tracking-tightest mb-8 text-foreground text-balance">
            Beginner Web Portfolio <br />
            <span className="gradient-text">Learning Frontend & Simple UI</span>
          </h1>
          <p className="max-w-2xl text-muted-foreground text-lg md:text-xl lg:text-2xl mb-12 font-medium leading-relaxed">
            Hi, I’m <span className="text-foreground border-b-2 border-primary/30 font-bold">Asep Haryana Saputra</span>. I build projects with React, Tailwind, and Next.js to gain practical experience and showcase fundamental skills.
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
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}

function Spotlight({ className, fill }: { className?: string; fill?: string }) {
  return (
    <svg
      className={"animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0 " + (className ?? "")}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 0.568943 -0.822377 3631.88 2291.09)"
          fill={fill || "white"}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8" />
        </filter>
      </defs>
    </svg>
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
          <div key={item.name} className={"row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-500 shadow-input dark:shadow-none p-4 bg-card border border-border/10 dark:border-white/[0.05] justify-between flex flex-col space-y-4 hover:border-primary/20 " + (index === 0 || index === 3 ? "md:col-span-2" : "")}>
            <div className="group/header h-full min-h-[10rem] rounded-2xl glass border-hairline flex items-center justify-center p-8 transition-all hover:bg-foreground/5 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity" />
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

      <NoSSR fallback={<UnifiedActivityLoader />}>
        {isLoading ? (
          <UnifiedActivityLoader />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Card className="p-8">
              <div className="mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Intelligence Radar</span>
                <h3 className="text-3xl font-black text-foreground mt-2 tracking-tight">Core Expertise</h3>
              </div>
              <div className="min-h-[400px] w-full flex items-center justify-center">
                {languages.length ? <SkillsRadarChart data={languages} /> : (<div className="text-center space-y-2"><p className="text-muted-foreground text-sm font-medium italic">Live statistics currently unavailable. Please try again later.</p><Badge variant="outline" className="text-[10px] opacity-50">Public API Fallback Active</Badge></div>)}
              </div>
            </Card>

            <Card className="p-8">
              <div className="mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Development Pulse</span>
                <h3 className="text-3xl font-black text-foreground mt-2 tracking-tight">Technical Consistency</h3>
              </div>
              <div className="min-h-[400px] w-full flex items-center justify-center">
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
              className="w-14 h-14 glass rounded-2xl flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all hover:-translate-y-2 border-hairline"
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
