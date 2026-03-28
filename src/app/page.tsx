import { Hero } from "@/components/home/hero"
import { Arsenal } from "@/components/home/arsenal"
import { GlitchText } from "@/components/ui/glitch-text"
import { GitHub, Instagram, LinkedIn } from "@/components/home/social-icons"

export default function Home() {
  const visualsUrl = process.env.VISUALS_URL || "https://visuals.asepharyana.tech/"

  return (
    <div className="relative z-10 w-full overflow-hidden">
        <Hero visualsUrl={visualsUrl} />
        <Arsenal />

        {/* Connection Section */}
        <section className="py-24 md:py-40 lg:py-56 px-6 overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto rounded-[3rem] md:rounded-[5rem] p-8 md:p-32 relative overflow-hidden glass border border-border/10 shadow-[0_80px_160px_rgba(0,0,0,0.2)] dark:shadow-[0_120px_250px_rgba(0,0,0,0.6)]">
                <div className="absolute -right-60 -top-60 w-[50rem] h-[50rem] bg-primary/10 rounded-full blur-[180px] animate-tilt-slow opacity-60" />
                <div className="absolute -left-60 -bottom-60 w-[50rem] h-[50rem] bg-accent/10 rounded-full blur-[180px] animate-tilt-reverse-slow opacity-40" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-20 md:space-y-24">
                    <div className="space-y-10 md:space-y-14">
                        <div className="space-y-8">
                            <span className="px-6 md:py-2.5 rounded-full glass-subtle text-[11px] font-black uppercase tracking-[0.6em] text-primary shadow-xl">
                                Communication
                            </span>
                            <h2 className="text-5xl md:text-9xl font-black italic tracking-tighter leading-none uppercase">
                                Get In <br/> <GlitchText text="Touch" className="text-primary" />
                            </h2>
                            <p className="text-lg md:text-3xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium italic tracking-tight">
                                I am always open to discussing new projects, creative ideas or professional opportunities.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                            <SocialLink href="https://github.com/MythEclipse" icon={<GitHub/>} label="GitHub" />
                            <SocialLink href="https://www.linkedin.com/in/asep-haryana-saputra-2014a5294/" icon={<LinkedIn/>} label="LinkedIn" />
                            <SocialLink href="https://www.instagram.com/asepharyana18/" icon={<Instagram/>} label="Instagram" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative p-5 md:p-6 rounded-[1.5rem] md:rounded-3xl glass border border-border/10 hover:bg-muted font-display transition-all hover:scale-110 active:scale-95 shadow-xl"
    >
        <div className="absolute inset-0 bg-primary/10 rounded-3xl scale-0 group-hover:scale-110 transition-transform blur-xl" />
        <div className="relative z-10 w-6 h-6 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
            {icon}
        </div>
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-primary text-[8px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
            {label}
        </span>
    </a>
  )
}
