"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function ErrorFallback({ error, reset }: { error: Error; reset?: () => void }) {
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()

  const errText = error.message?.toLowerCase() || ""
  const isApiError = ["fetch", "network", "http", "api", "cors", "timeout", "failed to fetch"].some(k => errText.includes(k))

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (reset) {
            reset()
          } else {
            router.refresh()
          }
          return 0
        }
        return c - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [reset, router])

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8">
      <div
        className={
          isApiError
            ? "max-w-md w-full border rounded-xl p-6 text-center bg-orange-500/10 border-orange-500/30"
            : "max-w-md w-full border rounded-xl p-6 text-center bg-destructive/10 border-destructive/20"
        }
      >
        <div
          className={
            isApiError
              ? "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-orange-500/20"
              : "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-destructive/20"
          }
        >
          {isApiError ? (
            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
            </svg>
          ) : (
            <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          )}
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-2">
          {isApiError ? "🔌 API Connection Error" : "Oops! Something went wrong"}
        </h2>

        <p className="text-muted-foreground mb-2 text-sm">{error.message}</p>

        {isApiError && (
          <p className="text-orange-500/80 mb-4 text-xs font-mono bg-orange-500/10 px-2 py-1 rounded">
            Server may be temporarily unavailable
          </p>
        )}

        <p className="text-muted-foreground mb-4 text-sm">
          Auto-refreshing in <span className="font-bold text-primary">{countdown}</span>s...
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => (reset ? reset() : router.refresh())}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Refresh Now
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
