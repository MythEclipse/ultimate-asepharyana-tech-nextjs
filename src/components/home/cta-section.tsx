import { Button } from "@/components/ui/button"
import { IconArrowRight, IconBrandGithub, IconBrandLinkedin, IconBrandInstagram } from "@tabler/icons-react"

export function CallToActionSection() {
  return (
    <section className="w-full py-48 relative flex flex-col items-center justify-center text-center px-4">
      <div className="absolute inset-0 bg-primary/20 blur-[160px] rounded-full mx-auto w-1/2 h-1/2 -z-10 animate-pulse-slow" />

      <h2 className="text-[clamp(2rem,10vw,6rem)] font-black text-foreground mb-12 leading-[0.9] tracking-tightest uppercase text-balance">
        Ready to Forge the <br /> <span className="text-gradient">Next Generation?</span>
      </h2>

      <p className="text-muted-foreground mb-12 max-w-2xl text-xl font-medium leading-relaxed">
        I'am currently available for high-impact projects and technical collaborations. Let&apos;s build something extraordinary together.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        <Button href="mailto:superaseph@gmail.com" size="xl" variant="shiny" className="shadow-2xl shadow-primary/40">
          Initiate Project <IconArrowRight className="ml-2" />
        </Button>

        <div className="flex items-center gap-4">
          {[
            { href: "https://github.com/MythEclipse", icon: IconBrandGithub, label: "GitHub" },
            { href: "https://linkedin.com", icon: IconBrandLinkedin, label: "LinkedIn" },
            { href: "https://instagram.com", icon: IconBrandInstagram, label: "Instagram" },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 glass rounded-2xl flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all hover:-translate-y-2 border-hairline"
            >
              <Icon size={24} className="text-foreground" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
