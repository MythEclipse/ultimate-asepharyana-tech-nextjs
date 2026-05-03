import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils/index"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm shadow-primary/10",
        secondary:
          "border-transparent bg-secondary/80 text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/90 text-destructive-foreground shadow-sm",
        outline: "border-border/60 text-foreground/80 bg-background/30 backdrop-blur-sm",
        glass: "glass border-hairline/50 text-foreground/90",
        glow: "border-primary/40 bg-primary/10 text-primary-foreground border-glow/50 animate-pulse-slow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
