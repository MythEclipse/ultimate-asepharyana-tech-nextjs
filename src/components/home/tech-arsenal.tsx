"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { TECH_STACK } from "@/lib/data/tech-stack";

export function TechArsenal() {
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
