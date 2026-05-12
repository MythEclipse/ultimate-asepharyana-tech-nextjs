import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"


interface NavLinkProps {
  href: string
  label: string
  currentPath: string
}

function NavLink({ href, label, currentPath }: NavLinkProps) {
  const isActive = currentPath === href || (href !== "/" && currentPath.startsWith(`${href}/`))

  return (
    <Link
      href={href}
      className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-xl relative group/link ${
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
    >
      <span className="relative z-10">{label}</span>
      {isActive && (
        <>
          <div className="absolute inset-0 bg-primary/5 rounded-xl border border-primary/10" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full blur-[2px] animate-pulse" />
        </>
      )}
    </Link>
  )
}

interface DesktopNavProps {
  themeToggle: React.ReactNode
}

export function DesktopNav({ themeToggle }: DesktopNavProps) {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex items-center space-x-2">
      {siteConfig.mainNav.map((item) => (
        <NavLink key={item.link} href={item.link} label={item.name} currentPath={pathname} />
      ))}

      <div className="w-8 h-px bg-border/50 mx-4" />

      {themeToggle}
    </div>
  )
}
