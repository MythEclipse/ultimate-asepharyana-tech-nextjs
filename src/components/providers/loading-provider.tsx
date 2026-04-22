"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

interface LoadingOverlayRequest {
  id: string
  label: string
}

interface LoadingOverlayContextValue {
  activeCount: number
  label: string | null
  requestOverlay: (label: string) => string
  releaseOverlay: (id: string) => void
}

const LoadingOverlayContext = createContext<LoadingOverlayContextValue | null>(null)

export function LoadingOverlayProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<LoadingOverlayRequest[]>([])

  const requestOverlay = useCallback((label: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

    setRequests((current) => [...current, { id, label }])

    return id
  }, [])

  const releaseOverlay = useCallback((id: string) => {
    setRequests((current) => current.filter((request) => request.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      activeCount: requests.length,
      label: requests.length > 0 ? requests[requests.length - 1].label : null,
      requestOverlay,
      releaseOverlay,
    }),
    [requests, requestOverlay, releaseOverlay]
  )

  return (
    <LoadingOverlayContext.Provider value={value}>
      {children}
    </LoadingOverlayContext.Provider>
  )
}

export function useLoadingOverlay() {
  const context = useContext(LoadingOverlayContext)

  if (!context) {
    throw new Error("useLoadingOverlay must be used within a LoadingOverlayProvider")
  }

  return context
}

export function useLoadingOverlayState() {
  const { activeCount, label } = useLoadingOverlay()
  return {
    show: activeCount > 0,
    label,
  }
}

export function usePageLoadingOverlay({ isLoading, label }: { isLoading: boolean; label: string }) {
  const { requestOverlay, releaseOverlay } = useLoadingOverlay()
  const overlayIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (isLoading) {
      if (!overlayIdRef.current) {
        overlayIdRef.current = requestOverlay(label)
      }
      return
    }

    if (overlayIdRef.current) {
      releaseOverlay(overlayIdRef.current)
      overlayIdRef.current = null
    }
  }, [isLoading, label, requestOverlay, releaseOverlay])

  useEffect(() => {
    return () => {
      if (overlayIdRef.current) {
        releaseOverlay(overlayIdRef.current)
        overlayIdRef.current = null
      }
    }
  }, [releaseOverlay])
}

export { LoadingOverlayProvider as LoadingProvider }
