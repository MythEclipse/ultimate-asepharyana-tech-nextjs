"use client"

import { useAuth } from "@/lib/store/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, setUser } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null // Or a loading spinner

  const userName = user.name || "Guest"
  const greeting = "Welcome back,"

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-40 scanlines">
      {/* Background Ambient Systems */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-5%] w-[45rem] h-[45rem] bg-blue-500/5 rounded-full blur-[120px] animate-tilt" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50rem] h-[50rem] bg-purple-500/5 rounded-full blur-[120px] animate-tilt-reverse" />
      </div>

      <div className="container mx-auto max-w-6xl px-8 pt-24 space-y-16 relative z-10">
        {/* Cinematic Hub Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 animate-fade-in">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">
              User Dashboard
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-tight">
              {greeting} <span className="text-blue-500">{userName}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
             <Link href="/settings" className="px-8 py-4 rounded-2xl glass border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group flex items-center gap-3">
                <svg className="w-5 h-5 text-muted-foreground group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
            </Link>
            <button
                onClick={handleLogout}
                className="px-8 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(239,68,68,0.2)] industrial-snap"
            >
                Logout
            </button>
          </div>
        </header>

        {/* Core Sector Navigation */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up [animation-delay:200ms]">
            <Link href="/anime" className="group relative block p-10 rounded-[3rem] glass border border-white/5 overflow-hidden transition-all duration-700 hover:border-blue-500/30 hover:shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 rounded-3xl bg-blue-500/20 flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 transition-transform duration-500">📺</div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Anime <span className="text-blue-500">Library</span></h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-relaxed">Media Streaming Service</p>
                    </div>
                 </div>
            </Link>
            
            <Link href="/komik" className="group relative block p-10 rounded-[3rem] glass border border-white/5 overflow-hidden transition-all duration-700 hover:border-orange-500/30 hover:shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                 <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 rounded-3xl bg-orange-500/20 flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 transition-transform duration-500">📖</div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Comic <span className="text-orange-500">Library</span></h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-relaxed">Digital Comic Reader</p>
                    </div>
                 </div>
            </Link>

            <Link href="/project" className="group relative block p-10 rounded-[3rem] glass border border-white/5 overflow-hidden transition-all duration-700 hover:border-purple-500/30 hover:shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 rounded-3xl bg-purple-500/20 flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 transition-transform duration-500">💼</div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Project <span className="text-purple-500">Gallery</span></h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-relaxed">Portfolio & Case Studies</p>
                    </div>
                 </div>
            </Link>
        </section>
        
        {/* Quick Links Panel */}
        <section className="animate-slide-up [animation-delay:400ms]">
            <div className="glass-card rounded-[3rem] p-10 border border-white/5 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl">⚡</div>
                        <h3 className="text-lg font-black uppercase tracking-[0.2em] text-foreground/60 italic">Quick Links</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <a href="https://rust.asepharyana.tech/docs" target="_blank" rel="noopener noreferrer"
                            className="group flex items-center gap-4 p-5 rounded-2xl glass border border-border/10 hover:border-primary/30 transition-all hover:scale-[1.02] active:scale-95">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center text-lg shrink-0">🦀</div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">Rust API</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Swagger Docs</p>
                            </div>
                        </a>
                        <a href="https://elysia.asepharyana.tech/docs" target="_blank" rel="noopener noreferrer"
                            className="group flex items-center gap-4 p-5 rounded-2xl glass border border-border/10 hover:border-primary/30 transition-all hover:scale-[1.02] active:scale-95">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-lg shrink-0">🔷</div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">Elysia API</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Swagger Docs</p>
                            </div>
                        </a>
                        <a href="https://github.com/MythEclipse" target="_blank" rel="noopener noreferrer"
                            className="group flex items-center gap-4 p-5 rounded-2xl glass border border-border/10 hover:border-primary/30 transition-all hover:scale-[1.02] active:scale-95">
                            <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center text-lg shrink-0">🐙</div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">GitHub</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Source Code</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
      </div>
    </main>
  )
}
