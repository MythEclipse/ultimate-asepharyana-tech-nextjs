"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/store/auth"

export default function LoginPage() {
  const router = useRouter()
  const { user, setUser } = useAuth()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }

    setIsSubmitting(true)

    // Simulate API login
    setTimeout(() => {
        setUser({ id: "1", name: email.split("@")[0], email })
        setIsSubmitting(false)
        router.push("/dashboard")
    }, 1000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Cinematic Background Infrastructure - Optimized */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute bottom-[-15%] right-[-5%] w-[45rem] h-[45rem] bg-blue-500/10 rounded-full blur-[80px] animate-tilt-reverse will-change-[transform,opacity]" />
      </div>

      <div className="w-full max-w-[480px] relative z-10 animate-fade-in group/main">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-[3rem] blur-2xl opacity-10 group-hover/main:opacity-20 transition-opacity duration-1000" />
        
        <div className="glass-card rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)] transition-all duration-700 hover:border-white/20 relative bg-background/50 backdrop-blur-3xl">
          <div className="p-12 space-y-10">
            {/* Security Header */}
            <header className="text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto group">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-125 animate-pulse" />
                <div className="relative w-full h-full rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl shadow-2xl transition-transform duration-700 group-hover:scale-110">
                  <span className="relative z-10">🛡️</span>
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                  Account <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Login</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Sign in to your account</p>
              </div>
            </header>

            {/* Error Notification */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-4 animate-slide-up">
                <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 font-black">!</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400 leading-tight">{error}</p>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-8 relative z-20">
              <div className="space-y-6">
                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 px-2 transition-colors group-focus-within/input:text-blue-500">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full bg-muted/5 border border-border/10 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-blue-500/30 transition-all text-sm font-medium tracking-tight placeholder:text-muted-foreground/10 text-foreground"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2 group/input relative z-20">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 px-2 transition-colors group-focus-within/input:text-blue-500">Password</label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 z-10">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-muted/5 border border-border/10 rounded-2xl py-5 pl-16 pr-20 focus:outline-none focus:border-blue-500/30 transition-all text-sm font-medium tracking-tight placeholder:text-muted-foreground/10 relative z-20 text-foreground"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-blue-500 transition-colors z-30 pointer-events-auto"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-6 rounded-2xl bg-foreground text-background font-black uppercase text-xs tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)] disabled:opacity-30 disabled:scale-100 relative group/btn overflow-hidden pointer-events-auto"
                disabled={isSubmitting}
              >
                <span className="relative z-10 transition-transform group-hover/btn:translate-x-1">
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover/btn:opacity-10 transition-opacity pointer-events-none" />
              </button>
            </form>

            <footer className="text-center relative z-20 pointer-events-auto">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-500 hover:text-blue-400 transition-colors pointer-events-auto">Register Now</Link>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  )
}
