
import Link from "next/link"

import { CachedImage } from "@/components/ui/cached-image"
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

interface FeatureCardProps {
  title: string
  description: string
  category: string
  image: string
  href: string
  actionLabel: string
}

export function FeatureCard({
  title,
  description,
  category,
  image,
  href,
  actionLabel,
}: FeatureCardProps) {
  const isExternal = href.startsWith("http")

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group"
    >
      <Card className="h-full flex flex-col overflow-hidden border-border/40 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-40 overflow-hidden">
          <CachedImage
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <span className="absolute top-3 right-3 rounded-md bg-background/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur-md">
            {category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4 gap-2">
          <Heading as="h3" className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </Heading>
          <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">
            {description}
          </p>
          <span className="mt-auto pt-3 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
            {actionLabel}
          </span>
        </div>
      </Card>
    </Link>
  )
}