"use client"

import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <main className="min-h-screen text-foreground relative overflow-hidden pb-40 transition-colors duration-500">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-24 space-y-16 relative z-10">
        {/* Cinematic Settings Header */}
        <header className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-card/40 backdrop-blur-md border border-border/10 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            System Parameters
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-foreground">
            Neural <span className="text-primary">Config</span>
          </h1>
          <div className="w-12 h-1 bg-linear-to-r from-primary to-accent mx-auto rounded-full" />
        </header>

        <div className="space-y-12">
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
                    theme === "system" ? "bg-blue-500/10 border-blue-500/40 text-blue-400" : "border-border/5 text-muted-foreground hover:bg-background/80 hover:text-foreground"
                }`}
              >
                <div className="relative z-10 space-y-3">
                  <span className="text-3xl block transition-transform group-hover/btn:scale-125 duration-500">💻</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Sync</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 scale-x-0 group-hover/btn:scale-x-50 transition-transform origin-center" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
