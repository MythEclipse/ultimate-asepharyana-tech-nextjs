"use client"

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { type Pagination } from "@/lib/api/types"

interface SharedPaginationControlProps {
  pagination: Pagination
  baseUrl: string
  variant?: "primary" | "indigo" | "red"
}

const variantClasses = {
  primary: {
    button: "border-border/10 hover:border-primary/50",
    next: "bg-primary hover:bg-primary/90",
    pageText: "text-primary",
  },
  indigo: {
    button: "border-border/10 hover:border-indigo-500/50",
    next: "bg-indigo-600 hover:bg-indigo-700",
    pageText: "text-indigo-500",
  },
  red: {
    button: "border-border/10 hover:border-red-500/50",
    next: "bg-red-600 hover:bg-red-700",
    pageText: "text-red-500",
  },
}

export function PaginationControl({ pagination, baseUrl, variant = "primary" }: SharedPaginationControlProps) {
  const { current_page, has_next_page, has_previous_page, last_visible_page } = pagination
  const styles = variantClasses[variant]

  return (
    <div className="flex items-center justify-center gap-4 mt-20 animate-fade-in">
      {has_previous_page ? (
        <Button
          href={`${baseUrl}/${current_page - 1}`}
          variant="secondary"
          className={`rounded-xl px-6 py-2 ${styles.button} transition-all font-black uppercase text-[10px] tracking-widest`}
        >
          <IconArrowLeft size={16} className="mr-2" /> Previous
        </Button>
      ) : (
        <button disabled className="px-6 py-2 bg-muted/20 text-muted-foreground/30 rounded-xl font-black uppercase tracking-widest text-[10px] cursor-not-allowed">
           Previous
        </button>
      )}

      <div className="flex items-center gap-2 px-6 py-2 bg-card/40 backdrop-blur-md rounded-xl border border-border/10 font-bold text-xs uppercase tracking-tighter">
        Page <span className={styles.pageText}>{current_page}</span> / {last_visible_page || "?"}
      </div>

      {has_next_page ? (
        <Button
          href={`${baseUrl}/${current_page + 1}`}
          className={`rounded-xl px-6 py-2 font-black uppercase text-[10px] tracking-widest ${styles.next}`}
        >
          Next <IconArrowRight size={16} className="ml-2" />
        </Button>
      ) : (
        <button disabled className="px-6 py-2 bg-muted/20 text-muted-foreground/30 rounded-xl font-black uppercase tracking-widest text-[10px] cursor-not-allowed">
           Next
        </button>
      )}
    </div>
  )
}
