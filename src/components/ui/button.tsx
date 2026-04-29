import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"
import * as React from "react"

import { cn } from "@/lib/utils/index"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 hover-lift",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background/50 backdrop-blur-sm shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-linear-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-x text-primary-foreground shadow-xl shadow-primary/20",
        shiny: "relative overflow-hidden bg-primary text-primary-foreground shadow-lg before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent hover:shadow-primary/40",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
        xl: "h-14 rounded-2xl px-12 text-lg font-semibold",
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
