"use client"

import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear().toString()

  return (
    <footer className="border-t border-white/10 mt-auto py-6 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-foreground">Asepharyana</span>
          </Link>
          <p className="text-xs text-muted-foreground">
            © {currentYear} Asep Haryana. Built with Passion
          </p>
        </div>
      </div>
    </footer>
  )
}
