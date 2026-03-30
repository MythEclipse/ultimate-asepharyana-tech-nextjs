"use client"

import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <section key={pathname} className="w-full transition-all duration-300">
      {children}
    </section>
  )
}
