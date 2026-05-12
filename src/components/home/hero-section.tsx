"use client";


import { IconArrowRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import githubStats from "@/lib/data/github-stats.json";

export function HeroSection() {
  const totalContributions = githubStats.totalContributions ??
    (githubStats as any).contributions?.reduce((sum: number, item: any) => sum + item.count, 0) ?? 0;

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
