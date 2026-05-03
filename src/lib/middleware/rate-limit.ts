import { NextRequest, NextResponse } from "next/server"

interface RateLimitConfig {
  limit: number
  windowMs: number
  keyGenerator?: (req: NextRequest) => string
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function cleanupStore(): void {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

setInterval(cleanupStore, 60000)

export function createRateLimiter(config: RateLimitConfig) {
  const { limit, windowMs, keyGenerator = defaultKeyGenerator } = config

  return function rateLimitMiddleware(req: NextRequest): NextResponse | null {
    const key = keyGenerator(req)
    const now = Date.now()

    const current = rateLimitStore.get(key)

    if (!current || now > current.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return null
    }

    if (current.count >= limit) {
      const retryAfter = Math.ceil((current.resetTime - now) / 1000)
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded",
          code: "RATE_LIMIT",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(current.resetTime),
          },
        }
      )
    }

    current.count++

    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Limit", String(limit))
    response.headers.set("X-RateLimit-Remaining", String(limit - current.count))
    response.headers.set("X-RateLimit-Reset", String(current.resetTime))

    return response
  }
}

function defaultKeyGenerator(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown"
  const userAgent = req.headers.get("user-agent") || "unknown"

  return `${ip}:${userAgent.slice(0, 50)}`
}

export const defaultRateLimiter = createRateLimiter({
  limit: 100,
  windowMs: 60000,
})

export const strictRateLimiter = createRateLimiter({
  limit: 10,
  windowMs: 60000,
})