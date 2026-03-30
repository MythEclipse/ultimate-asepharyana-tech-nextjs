"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { API_BASE_URL } from "@/lib/api/config"

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string
  fallbackSrc?: string
  eager?: boolean
  fill?: boolean
  retryEnabled?: boolean
  maxAttempts?: number
}

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900' viewBox='0 0 1200 900'%3E%3Crect width='1200' height='900' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial,Helvetica,sans-serif' font-size='42'%3EImage unavailable%3C/text%3E%3C/svg%3E"

export function CachedImage({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackSrc = FALLBACK_IMAGE,
  loading = "lazy",
  eager = false,
  fill = false,
  retryEnabled = true,
  maxAttempts = 2,
  ...props
}: CachedImageProps) {
  const normalizedSrc = !src || String(src).trim().length === 0 ? fallbackSrc : String(src)

  const [resolvedSrc, setResolvedSrc] = useState(normalizedSrc)
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("loading")
  const [attempt, setAttempt] = useState(0)
  const [isAuditing, setIsAuditing] = useState(false)

  useEffect(() => {
    setResolvedSrc(normalizedSrc)
    setLoadState("loading")
    setAttempt(0)
  }, [normalizedSrc])

  const imageSrc = loadState === "error" ? fallbackSrc : resolvedSrc

  const fallbackCls = fallbackClassName || "bg-muted animate-pulse"

  const wrapperClass = cn(
    fill ? "absolute inset-0" : "relative w-full",
    "overflow-hidden"
  )

  const effectiveLoading = eager ? "eager" : loading
  const isFallback = imageSrc === fallbackSrc

  async function auditImage(srcUrl: string) {
    if (!srcUrl || srcUrl === fallbackSrc) return

    try {
      setIsAuditing(true)
      const auditUrl = `${API_BASE_URL}/proxy/image-cache/audit`
      const response = await fetch(auditUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: srcUrl }),
      })

      if (!response.ok) {
        throw new Error(`Audit API failed ${response.status}`)
      }

      const result = await response.json()
      console.debug("Image cache audit result", result)

      if (result?.success && result?.cdn_url) {
        setResolvedSrc(result.cdn_url)
        setLoadState("loading")
        setAttempt(0)
      }
    } catch (auditErr) {
      console.warn("Audit image cache failed", auditErr)
    } finally {
      setIsAuditing(false)
    }
  }

  const imgStyles = useMemo(
    () =>
      cn(
        className,
        "transition-opacity duration-500 ease-out transform-gpu",
        loadState !== "loaded" ? "opacity-0 scale-105 blur-sm" : "opacity-100 scale-100 blur-0",
        loadState === "error" ? "grayscale" : ""
      ),
    [className, loadState]
  )

  const handleRetry = () => {
    setLoadState("loading")
    setAttempt((prev) => prev + 1)
    setResolvedSrc(normalizedSrc)
  }

  return (
    <div className={wrapperClass}>
      {loadState !== "loaded" && loadState !== "error" && (
        <div className={cn("absolute inset-0", fallbackCls)} />
      )}

      {loadState === "error" && retryEnabled && (
        <div className={cn("absolute inset-0 flex flex-col items-center justify-center gap-2 text-center", fallbackCls)}>
          <span className="text-2xl opacity-40">🛠️</span>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Failed to load</p>
          <button
            className="px-3 py-1 rounded-md text-xs font-black uppercase border border-primary/30 bg-primary/10 hover:bg-primary/20"
            onClick={(e) => {
              e.preventDefault()
              handleRetry()
            }}
            aria-label="Retry loading image"
          >
            Retry
          </button>
        </div>
      )}

      {imageSrc && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={`${imageSrc}-${attempt}`}
          src={imageSrc}
          alt={alt || "Image"}
          loading={effectiveLoading}
          className={imgStyles}
          onLoad={() => setLoadState("loaded")}
          onError={async () => {
            if (attempt < maxAttempts) {
              setAttempt((prev) => prev + 1)
              setLoadState("loading")
              setResolvedSrc(normalizedSrc)
            } else {
              setLoadState("error")

              if (!isAuditing && !isFallback) {
                await auditImage(resolvedSrc)
              }
            }
          }}
          {...props}
        />
      )}

      {isAuditing && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          Optimizing image source...
        </div>
      )}
    </div>
  )
}

