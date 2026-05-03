import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"
import * as React from "react"

import { cn } from "@/lib/utils/index"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md shadow-primary/15 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-border/60 bg-background/40 backdrop-blur-sm hover:bg-accent/60 hover:border-primary/40 hover:text-accent-foreground",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary",
        ghost: "hover:bg-accent/60 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-linear-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-x text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl",
        shiny: "relative overflow-hidden bg-primary text-primary-foreground shadow-md before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent hover:shadow-primary/30",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-11 px-6 text-base rounded-lg",
        icon: "h-10 w-10 rounded-lg",
        xl: "h-12 px-8 text-base font-semibold rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends VariantProps<typeof buttonVariants> {
  asChild?: boolean
  href?: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  type?: "button" | "submit" | "reset"
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
}

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  ({ className, variant, size, asChild = false, href, disabled, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className)

    if (href) {
      if (asChild) {
        console.warn("Button: 'asChild' is ignored when 'href' is provided")
      }

      if (disabled) {
        return (
          <span className={cn(classes, "cursor-not-allowed opacity-60")}
            aria-disabled="true"
          >
            {props.children}
          </span>
        )
      }

      return (
        <Link
          href={href}
          className={classes}
          aria-disabled={disabled ? "true" : undefined}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        >
          {props.children}
        </Link>
      )
    }

    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={classes}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        disabled={disabled}
        aria-disabled={disabled ? "true" : undefined}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
