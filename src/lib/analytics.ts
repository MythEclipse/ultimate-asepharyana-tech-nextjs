"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useCallback } from "react"

type AnalyticsEvent = {
  action: string
  category: string
  label?: string
  value?: number
}

const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID

export function trackEvent(event: AnalyticsEvent): void {
  if (!ANALYTICS_ID || typeof window === "undefined") return

  const { action, category, label, value } = event

  if (typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    })
  }
}

export function trackPageView(url: string, title?: string): void {
  if (!ANALYTICS_ID || typeof window === "undefined") return

  if (typeof window.gtag === "function") {
    window.gtag("config", ANALYTICS_ID, {
      page_path: url,
      page_title: title,
    })
  }
}

export function useAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "")
    trackPageView(url, document.title)
  }, [pathname, searchParams])

  const trackClick = useCallback(
    (element: string, action = "click") => {
      trackEvent({
        action,
        category: "engagement",
        label: element,
      })
    },
    []
  )

  return { trackClick, trackEvent, trackPageView }
}

declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}