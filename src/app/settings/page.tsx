"use client"

import { useAuth } from "@/lib/store/auth"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect } from "react"

export default function SettingsPage() {
  const { user, setUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden pb-40 transition-colors duration-500">
      {/* Background Ambient Systems */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] animate-tilt-slow" />
        <div className="absolute bottom-[10%] left-[5%] w-[35rem] h-[35rem] bg-accent/5 rounded-full blur-[120px] animate-tilt-reverse-slow" />
      </div>

      <div className="container mx-auto max-w-3xl px-8 pt-24 space-y-16 relative z-10">
        {/* Cinematic Settings Header */}
        <header className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-card/40 backdrop-blur-md border border-border/10 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            System Parameters
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-foreground">
            Neural <span className="text-primary">Config</span>
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </header>

        <div className="space-y-12">
          {/* Profile Intelligence Section */}
          <section className="bg-card/40 backdrop-blur-md rounded-[3rem] p-10 border border-border/5 animate-slide-up [animation-delay:200ms] group hover:border-border/20 transition-all duration-700">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl shadow-2xl">🧠</div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase text-foreground">Profile <span className="text-muted-foreground/40">Identity</span></h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Current Instance Parameters</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 p-6 rounded-2xl bg-muted/5 border border-border/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Alias</label>
                <p className="text-lg font-black italic tracking-tight text-foreground">{user?.name || ""}</p>
              </div>
              <div className="space-y-2 p-6 rounded-2xl bg-muted/5 border border-border/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Uplink ID</label>
                <p className="text-lg font-black italic tracking-tight text-foreground">{user?.email || ""}</p>
              </div>
            </div>
          </section>
          
          {/* Chromatic Architecture Section */}
          <section className="bg-card/40 backdrop-blur-md rounded-[3rem] p-10 border border-border/5 animate-slide-up [animation-delay:400ms] group hover:border-border/20 transition-all duration-700">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl shadow-2xl">🎨</div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase text-foreground">Chromatic <span className="text-muted-foreground/40">Engine</span></h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Visual Interface Management</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <button
                onClick={() => setTheme("light")}
                className={`relative group/btn p-8 rounded-[2rem] bg-card/40 backdrop-blur-md border transition-all duration-500 active:scale-95 ${
                    theme === "light" ? "bg-blue-500/10 border-blue-500/40 text-blue-400" : "border-border/5 text-muted-foreground hover:bg-background/80 hover:text-foreground"
                }`}
              >
                <div className="relative z-10 space-y-3">
                  <span className="text-3xl block transition-transform group-hover/btn:scale-125 duration-500">☀️</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Light Level</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 scale-x-0 group-hover/btn:scale-x-50 transition-transform origin-center" />
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`relative group/btn p-8 rounded-[2rem] bg-card/40 backdrop-blur-md border transition-all duration-500 active:scale-95 ${
                    theme === "dark" ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400" : "border-border/5 text-muted-foreground hover:bg-background/80 hover:text-foreground"
                }`}
              >
                <div className="relative z-10 space-y-3">
                  <span className="text-3xl block transition-transform group-hover/btn:scale-125 duration-500">🌙</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Void Mode</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover/btn:scale-x-50 transition-transform origin-center" />
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`relative group/btn p-8 rounded-[2rem] bg-card/40 backdrop-blur-md border transition-all duration-500 active:scale-95 ${
                    theme === "system" ? "bg-purple-500/10 border-purple-500/40 text-purple-400" : "border-border/5 text-muted-foreground hover:bg-background/80 hover:text-foreground"
                }`}
              >
                <div className="relative z-10 space-y-3">
                  <span className="text-3xl block transition-transform group-hover/btn:scale-125 duration-500">💻</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Sync</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-purple-500 scale-x-0 group-hover/btn:scale-x-50 transition-transform origin-center" />
              </button>
            </div>
          </section>

          {/* Terminal Protocol Section */}
          <section className="bg-red-500/5 backdrop-blur-md rounded-[3rem] p-10 border border-red-500/10 animate-slide-up [animation-delay:600ms] group hover:border-red-500/30 transition-all duration-700">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-2xl shadow-2xl">⚠️</div>
                <div className="space-y-1">
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase text-red-500">Terminal <span className="text-red-500/40">Protocol</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500/30">Emergency De-authentication</p>
                </div>
            </div>
            
            <p className="text-sm font-medium italic text-red-500/60 mb-8 max-w-lg leading-relaxed">
                Executing this protocol will immediately decouple your neural instance from the central cluster and revoke all active session keys.
            </p>

             <button
                onClick={handleLogout}
                className="px-12 py-5 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-red-500/20"
            >
                Terminate Instance
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}
