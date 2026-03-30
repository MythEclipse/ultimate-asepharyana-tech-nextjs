"use client"

interface DetailInfoProps {
  icon: React.ElementType
  label: string
  value?: string
  iconBgClass?: string
}

export function DetailInfo({ icon: Icon, label, value, iconBgClass = "bg-muted" }: DetailInfoProps) {
  if (!value || value === "Unknown") return null

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/10 last:border-0 transition-colors">
      <div className={`w-8 h-8 rounded-lg ${iconBgClass} flex items-center justify-center text-primary/80 shrink-0`}>
        <Icon size={16} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>
        <span className="text-sm font-bold text-foreground">{value}</span>
      </div>
    </div>
  )
}
