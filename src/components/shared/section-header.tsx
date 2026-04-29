"use client"

import { IconArrowRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/index"

interface SectionHeaderProps {
  title: string
  icon: React.ElementType
  color: string
  link: string
}

export function SectionHeader({ title, icon: Icon, color, link }: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-4">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
          <Icon size={24} />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight">{title}</h2>
          <div className={cn("h-1.5 w-20 mt-2 rounded-full", color)} />
        </div>
      </div>
      <Button href={link} variant="outline" size="sm" className="rounded-xl border-border/40 hover:bg-muted transition-all">
        View Full List <IconArrowRight size={14} className="ml-2" />
      </Button>
    </div>
  )
}