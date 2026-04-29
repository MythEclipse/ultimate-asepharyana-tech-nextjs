"use client"

import { useEffect } from "react"

import { ErrorFallback } from "@/components/ui/error-fallback"

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return <ErrorFallback error={error} reset={unstable_retry} />
}
