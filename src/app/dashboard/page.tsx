"use client"

import { useAuth } from "@/lib/store/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Spotlight } from "@/components/ui/spotlight"
import { IconSettings, IconLogout, IconDeviceTv, IconBook, IconBriefcase, IconExternalLink, IconBrandGithub } from "@tabler/icons-react"

export default function DashboardPage() {
  const { user, setUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null 

  const userName = user.name || "System Administrator"
  const handleLogout = () => {
    setUser(null)
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="var(--color-primary)" />
      
      <Section className="pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-24 animate-fade-in translate-y-0 opacity-100 transition-all duration-700">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <Badge variant="glow" className="px-4 py-1 uppercase text-[10px] font-black tracking-[0.2em]">
                  Control Center
               </Badge>
               <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Status
               </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tightest text-foreground leading-[0.9]">
              WELCOME <br /> <span className="text-gradient uppercase">{userName}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
             <Button href="/settings" variant="outline" className="glass border-hairline rounded-2xl h-12 px-6 font-bold">
                <IconSettings size={20} className="mr-2 opacity-70" /> Settings
             </Button>
             <Button
                onClick={handleLogout}
                variant="destructive"
                className="rounded-2xl h-12 px-6 shadow-2xl shadow-destructive/20 font-bold"
             >
                <IconLogout size={20} className="mr-2" /> Logout
             </Button>
          </div>
        </header>

        {/* Global Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
            <Link href="/anime" className="md:col-span-8 group">
                <Card className="h-full min-h-[320px] p-10 flex flex-col justify-end group-hover:border-primary/40">
                     <div className="absolute top-10 right-10 w-20 h-20 rounded-3xl glass border-hairline flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <IconDeviceTv size={32} stroke={1.5} />
                     </div>
                     <div className="space-y-3">
                        <Badge variant="glass" className="font-black text-[10px] tracking-[0.2em] uppercase">Modules / Entertainment</Badge>
                        <h2 className="text-4xl font-black tracking-tighter italic">ANIME <span className="text-primary">HUB</span></h2>
                        <p className="text-sm text-muted-foreground font-medium max-w-sm">High-performance video delivery with real-time metadata synchronization.</p>
                     </div>
                </Card>
            </Link>
            
            <Link href="/komik" className="md:col-span-4 group">
                <Card className="h-full min-h-[320px] p-10 flex flex-col justify-end group-hover:border-orange-500/40">
                     <div className="absolute top-10 right-10 w-16 h-16 rounded-2xl glass border-hairline flex items-center justify-center text-orange-500 group-hover:-translate-y-2 transition-all duration-500">
                        <IconBook size={28} stroke={1.5} />
                     </div>
                     <div className="space-y-3">
                        <h2 className="text-3xl font-black tracking-tighter italic">COMIC <span className="text-orange-500">LAB</span></h2>
                        <p className="text-xs text-muted-foreground font-medium">Universal reading engine.</p>
                     </div>
                </Card>
            </Link>

            <Link href="/project" className="md:col-span-12 group">
                 <Card className="p-10 min-h-[200px] flex items-center justify-between group-hover:border-blue-500/40">
                     <div className="space-y-3">
                        <h2 className="text-4xl font-black tracking-tighter italic">CASE STUDIES & <span className="text-blue-500">PROJECTS</span></h2>
                        <p className="text-sm text-muted-foreground font-medium">Review architectural decisions and technical implementation details.</p>
                     </div>
                     <div className="w-16 h-16 rounded-2xl glass border-hairline flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform hidden md:flex">
                        <IconBriefcase size={32} stroke={1.5} />
                     </div>
                </Card>
            </Link>
        </div>
        
        {/* Technical Resources Panel */}
        <div className="w-full">
            <Card className="p-10">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-10 h-10 rounded-xl glass border-hairline flex items-center justify-center text-primary">
                       <IconExternalLink size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">Infrastructure Cluster</h3>
                      <p className="text-xs text-muted-foreground font-medium mt-1">Direct access to core system documentation.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a href="https://rust.asepharyana.tech/docs" target="_blank" rel="noopener noreferrer"
                        className="group p-6 rounded-2xl glass border-hairline hover:border-primary/40 transition-all flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">🦀</div>
                          <IconExternalLink size={16} className="text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all" />
                        </div>
                        <div>
                           <p className="text-sm font-black tracking-tight group-hover:text-primary transition-colors uppercase">Rust Core API</p>
                           <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">Production V1 Docs</p>
                        </div>
                    </a>

                    <a href="https://elysia.asepharyana.tech/docs" target="_blank" rel="noopener noreferrer"
                        className="group p-6 rounded-2xl glass border-hairline hover:border-blue-500/40 transition-all flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">🔷</div>
                          <IconExternalLink size={16} className="text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-blue-400 transition-all" />
                        </div>
                        <div>
                           <p className="text-sm font-black tracking-tight group-hover:text-blue-400 transition-colors uppercase">Elysia Cloud</p>
                           <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">Edge Integration</p>
                        </div>
                    </a>

                    <a href="https://github.com/MythEclipse" target="_blank" rel="noopener noreferrer"
                        className="group p-6 rounded-2xl glass border-hairline hover:border-foreground/40 transition-all flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl opacity-30 group-hover:opacity-100 transition-all"><IconBrandGithub size={32} /></div>
                          <IconExternalLink size={16} className="text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-foreground transition-all" />
                        </div>
                        <div>
                           <p className="text-sm font-black tracking-tight group-hover:text-foreground transition-colors uppercase">Core Repo</p>
                           <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">Git Manifest</p>
                        </div>
                    </a>
                </div>
            </Card>
        </div>
      </Section>
    </main>
  )
}
