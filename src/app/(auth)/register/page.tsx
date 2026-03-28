"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/store/auth"

export default function RegisterPage() {
  const router = useRouter()
  const { user, setUser } = useAuth()
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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
    
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setIsSubmitting(true)

    // Simulate API registration
    setTimeout(() => {
        setUser({ id: "1", name: name || email.split("@")[0], email })
        setIsSubmitting(false)
        router.push("/dashboard")
    }, 1000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-black/20">
      {/* Cinematic Background Infrastructure */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-purple-500/10 rounded-full blur-[120px] animate-tilt" />
        <div className="absolute top-[-15%] right-[-5%] w-[45rem] h-[45rem] bg-indigo-500/10 rounded-full blur-[120px] animate-tilt-reverse" />
      </div>

      <div className="w-full max-w-[520px] relative z-10 animate-fade-in group/main">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-[3rem] blur-2xl opacity-10 group-hover/main:opacity-20 transition-opacity duration-1000" />
        
        <div className="glass-card rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)] transition-all duration-700 hover:border-white/20 relative bg-background/50 backdrop-blur-3xl">
          <div className="p-10 md:p-12 space-y-10">
            {/* Security Header */}
            <header className="text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                  Create <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Account</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Join the community today</p>
              </div>
            </header>

            {/* Error Notification */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-4 animate-slide-up">
                <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 font-black">!</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400 leading-tight">{error}</p>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6 relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 px-2 transition-colors group-focus-within/input:text-purple-500">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-purple-500/30 transition-all text-sm font-medium tracking-tight placeholder:text-muted-foreground/10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 px-2 transition-colors group-focus-within/input:text-purple-500">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-purple-500/30 transition-all text-sm font-medium tracking-tight placeholder:text-muted-foreground/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 group/input">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 px-2 transition-colors group-focus-within/input:text-purple-500">Password</label>
                <div className="relative z-20">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-purple-500/30 transition-all text-sm font-medium tracking-tight placeholder:text-muted-foreground/10 relative z-10 pr-20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-purple-500 transition-colors z-20 pointer-events-auto"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="space-y-2 group/input">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 px-2 transition-colors group-focus-within/input:text-purple-500">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-white/2 border border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-purple-500/30 transition-all text-sm font-medium tracking-tight placeholder:text-muted-foreground/10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-6 rounded-2xl bg-foreground text-background font-black uppercase text-xs tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-30 disabled:scale-100 relative group/btn overflow-hidden pointer-events-auto"
                disabled={isSubmitting}
              >
                <span className="relative z-10 transition-transform group-hover/btn:translate-x-1">
                  {isSubmitting ? "Registering..." : "Register"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-0 group-hover/btn:opacity-10 transition-opacity pointer-events-none" />
              </button>
            </form>

            <footer className="text-center pt-4 relative z-20 pointer-events-auto">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-500 hover:text-purple-400 transition-colors pointer-events-auto">Login</Link>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  )
}
