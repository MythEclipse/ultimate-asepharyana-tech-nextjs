import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"


interface MobileNavLinkProps {
  href: string
  label: string
  isActive: boolean
  onClick: () => void
}

function MobileNavLink({ href, label, isActive, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block py-4 px-6 text-lg font-black italic uppercase tracking-tighter border rounded-xl transition-all duration-300 active:scale-95 ${
        isActive
          ? "bg-primary/10 border-primary/20 text-primary"
          : "border-white/5 hover:bg-white/5 hover:border-white/10 text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  )
}

interface MobileNavProps {
  themeToggle: React.ReactNode
  onClose: () => void
}

export function MobileNav({ themeToggle, onClose }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-3xl animate-fade-in overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">
        {siteConfig.mainNav.map((item) => (
          <MobileNavLink
            key={item.link}
            href={item.link}
            label={item.name}
            isActive={pathname === item.link || pathname.startsWith(`${item.link}/`)}
            onClick={onClose}
          />
        ))}

        <div className="pt-8 mt-8 border-t border-border/20 flex items-center justify-between">
          {themeToggle}
        </div>
      </div>
    </div>
  )
}