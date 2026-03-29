"use client"

import { FloatingNav } from "@/components/ui/floating-navbar"
import { HeroSection } from "@/components/home/hero-section"
import { TechArsenal } from "@/components/home/tech-arsenal"
import { ActivitySection } from "@/components/home/activity-section"
import { CallToActionSection } from "@/components/home/cta-section"
import { IconCode, IconCpu, IconDatabase, IconGlobe } from "@tabler/icons-react"

export default function Home() {
  const navItems = [
    { name: "Home", link: "/", icon: <IconCode className="h-4 w-4" /> },
    { name: "Projects", link: "/project", icon: <IconGlobe className="h-4 w-4" /> },
    { name: "Anime", link: "/anime", icon: <IconCpu className="h-4 w-4" /> },
    { name: "Dashboard", link: "/dashboard", icon: <IconDatabase className="h-4 w-4" /> },
  ]

  return (
    <main className="relative flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <FloatingNav navItems={navItems} />

      <HeroSection />
      <TechArsenal />
      <ActivitySection />
      <CallToActionSection />
    </main>
  )
}
