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
import { IconSettings, IconLogout, IconDeviceTv, IconBook, IconBriefcase, IconExternalLink, IconBrandGithub, IconCircleCheck } from "@tabler/icons-react"

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
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden relative transition-colors duration-500">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="var(--color-primary)" />
      
      <Section className="pt-32 pb-20 relative z-10 px-6">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-20 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-3 py-1 uppercase text-[10px] font-black tracking-widest">
                  Control Center
               </Badge>
               <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  <IconCircleCheck size={12} /> Live Status
               </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic text-foreground">
              WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-primary/50">{userName.toUpperCase()}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
             <Button href="/settings" variant="outline" className="rounded-2xl border-border/10 bg-muted/5 hover:bg-muted/10 transition-all font-bold">
                <IconSettings size={18} className="mr-2" /> Settings
             </Button>
             <Button
                onClick={handleLogout}
                variant="destructive"
                className="rounded-2xl shadow-lg shadow-destructive/20"
             >
                <IconLogout size={18} className="mr-2" /> Logout
             </Button>
          </div>
        </header>

        {/* Global Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link href="/anime" className="group">
                <Card className="p-8 h-full bg-card/60 border-border/10 group-hover:border-primary/50 transition-all duration-500 cursor-pointer overflow-hidden relative">
                     <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                     <div className="relative z-10 space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <IconDeviceTv size={28} stroke={1.5} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black italic tracking-tight">ANIME <span className="text-primary">HUB</span></h2>
                            <p className="text-xs text-muted-foreground font-medium tracking-wide">Enter the high-fidelity streaming interface.</p>
                        </div>
                     </div>
                </Card>
            </Link>
            
            <Link href="/komik" className="group">
                <Card className="p-8 h-full bg-card/60 border-border/10 group-hover:border-orange-500/50 transition-all duration-500 cursor-pointer overflow-hidden relative">
                     <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
                     <div className="relative z-10 space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                           <IconBook size={28} stroke={1.5} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black italic tracking-tight">COMIC <span className="text-orange-500">INDEX</span></h2>
                            <p className="text-xs text-muted-foreground font-medium tracking-wide">Access the universal digital reading library.</p>
                        </div>
                     </div>
                </Card>
            </Link>

            <Link href="/project" className="group">
                 <Card className="p-8 h-full bg-card/60 border-border/10 group-hover:border-purple-500/50 transition-all duration-500 cursor-pointer overflow-hidden relative">
                     <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
                     <div className="relative z-10 space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                           <IconBriefcase size={28} stroke={1.5} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black italic tracking-tight">PROJECT <span className="text-purple-500">LAB</span></h2>
                            <p className="text-xs text-muted-foreground font-medium tracking-wide">Review technical case studies and experiments.</p>
                        </div>
                     </div>
                </Card>
            </Link>
        </div>
        
        {/* Technical Resources Panel */}
        <div className="max-w-44 xl:max-w-none">
            <Card className="p-8 bg-card/40 border-border/10 relative overflow-hidden transition-colors">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-primary">
                           <IconExternalLink size={16} />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60">Technical Resources</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <a href="https://rust.asepharyana.tech/docs" target="_blank" rel="noopener noreferrer"
                            className="group flex items-center justify-between p-5 rounded-2xl bg-muted/5 border border-border/10 hover:border-primary/40 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="text-2xl">🦀</div>
                               <div>
                                   <p className="text-sm font-bold group-hover:text-primary transition-colors">Rust Core API</p>
                                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Production API Docs</p>
                               </div>
                            </div>
                            <IconExternalLink size={14} className="text-muted-foreground/40 group-hover:text-primary transition-colors" />
                        </a>
                        <a href="https://elysia.asepharyana.tech/docs" target="_blank" rel="noopener noreferrer"
                            className="group flex items-center justify-between p-5 rounded-2xl bg-muted/5 border border-border/10 hover:border-blue-500/40 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="text-2xl">🔷</div>
                               <div>
                                   <p className="text-sm font-bold group-hover:text-blue-400 transition-colors">Elysia Middleware</p>
                                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Edge Architecture</p>
                               </div>
                            </div>
                            <IconExternalLink size={14} className="text-muted-foreground/40 group-hover:text-blue-400 transition-colors" />
                        </a>
                        <a href="https://github.com/MythEclipse" target="_blank" rel="noopener noreferrer"
                            className="group flex items-center justify-between p-5 rounded-2xl bg-muted/5 border border-border/10 hover:border-foreground/40 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="text-2xl"><IconBrandGithub size={24} /></div>
                               <div>
                                   <p className="text-sm font-bold group-hover:text-foreground transition-colors">Main Repository</p>
                                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Open Source Core</p>
                               </div>
                            </div>
                            <IconExternalLink size={14} className="text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                        </a>
                    </div>
                </div>
            </Card>
        </div>
      </Section>
    </main>
  )
}
