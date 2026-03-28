"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string
}

export function CachedImage({
  src,
  alt,
  className,
  fallbackClassName,
  loading = "lazy",
  ...props
}: CachedImageProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const fallbackCls = fallbackClassName || "bg-muted animate-pulse"

  return (
    <div className="relative w-full h-full">
      {!loaded && !error && (
        <div className={cn("absolute inset-0", fallbackCls)} />
      )}

      {error && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-2 text-center",
            fallbackCls
          )}
        >
          <span className="text-2xl opacity-40">🖼️</span>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
            Unavailable
          </p>
        </div>
      )}

      {src && (
         /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt || "Image"}
          loading={loading}
          className={cn(
            className,
            "transition-opacity duration-500 ease-out transform-gpu",
            !loaded || error ? "opacity-0 scale-105 blur-sm" : "opacity-100 scale-100 blur-0",
            error ? "grayscale" : ""
          )}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true)
            // Trigger server audit here via a server action if needed
            // e.g. await auditImageAction(src)
          }}
          {...props}
        />
      )}
    </div>
  )
}
