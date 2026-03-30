"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spotlight } from "@/components/ui/spotlight"
import { IconArrowRight } from "@tabler/icons-react"

export function HeroSection() {
  return (
    <section className="pb-20 pt-36 min-h-[90vh] w-full flex flex-col items-center justify-center relative">
      <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="var(--color-primary)" />
      <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="var(--color-accent)" />

      <div className="flex justify-center relative my-20 z-10 w-full text-center">
        <div className="max-w-[89vw] md:max-w-4xl flex flex-col items-center">
          <Badge variant="glass" className="mb-8 px-4 py-1.5 uppercase tracking-[0.3em] font-black">
            Software Engineering
          </Badge>

          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[0.95] tracking-tightest mb-8 text-foreground text-balance">
            Practical Solutions for <br />
            <span className="text-primary">Modern Web Systems</span>
          </h1>

          <p className="max-w-2xl text-muted-foreground text-lg md:text-xl lg:text-2xl mb-12 font-medium leading-relaxed">
            I&apos;m <span className="text-foreground border-b-2 border-primary/30 font-bold">Asep Haryana Saputra</span>, focused on stable backend architecture and efficient frontend delivery.
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

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  )
}
