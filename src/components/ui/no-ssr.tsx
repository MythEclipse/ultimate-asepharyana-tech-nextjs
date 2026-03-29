"use client"

import { useEffect, useState } from "react"

export function NoSSR({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(handle)
  }, [])

  if (!mounted) {
    return <>{fallback || null}</>
  }

  return <>{children}</>
}
