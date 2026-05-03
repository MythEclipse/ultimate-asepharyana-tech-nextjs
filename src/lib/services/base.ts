import { API_BASE_URL } from "@/lib/api/config"

class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message)
    this.name = "ServiceError"
  }
}

export interface ServiceOptions {
  timeout?: number
  retries?: number
  cache?: RequestCache
}

const DEFAULT_TIMEOUT = 10000
const DEFAULT_RETRIES = 3

class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  constructor(private limit: number = 100, private windowMs: number = 60000) {}

  isAllowed(key: string): boolean {
    const now = Date.now()
    const timestamps = this.requests.get(key) || []
    const validTimestamps = timestamps.filter((t) => now - t < this.windowMs)

    if (validTimestamps.length >= this.limit) {
      return false
    }

    validTimestamps.push(now)
    this.requests.set(key, validTimestamps)
    return true
  }

  reset(key: string): void {
    this.requests.delete(key)
  }
}

export const rateLimiter = new RateLimiter()

function sanitizeResponse(data: unknown): unknown {
  if (data === null || data === undefined) return data

  if (typeof data === "string") {
    return data
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .trim()
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeResponse)
  }

  if (typeof data === "object") {
    const sanitized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (key.toLowerCase().includes("password") || key.toLowerCase().includes("token") || key.toLowerCase().includes("secret")) {
        sanitized[key] = "[REDACTED]"
      } else {
        sanitized[key] = sanitizeResponse(value)
      }
    }
    return sanitized
  }

  return data
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number }
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit & { retries?: number; timeout?: number }
): Promise<Response> {
  const { retries = DEFAULT_RETRIES, timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, { ...fetchOptions, timeout })
      if (response.ok || attempt === retries) {
        return response
      }
    } catch (error) {
      lastError = error as Error
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }
  }

  throw lastError || new Error("Request failed after retries")
}

export async function fetchService<T>(
  endpoint: string,
  options: RequestInit & ServiceOptions = {}
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    cache = "force-cache",
    ...fetchOptions
  } = options

  const url = `${API_BASE_URL}${endpoint}`
  const headers = fetchOptions.headers as Record<string, string> | undefined
  const clientIp = headers?.["x-forwarded-for"] || "unknown"
  const rateLimitKey = `rl_${clientIp}`

  if (!rateLimiter.isAllowed(rateLimitKey)) {
    throw new ServiceError("Rate limit exceeded", "RATE_LIMIT", { retryAfter: 60 })
  }

  const response = await fetchWithRetry(url, {
    ...fetchOptions,
    timeout,
    retries,
    cache,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      ...fetchOptions.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ServiceError(
      errorData.message || `API Request failed with status ${response.status}`,
      errorData.code || "API_ERROR",
      errorData.details
    )
  }

  const rawData = await response.json()
  return sanitizeResponse(rawData) as T
}

export function createService(baseEndpoint: string) {
  return {
    get: <R>(path: string, options?: ServiceOptions) =>
      fetchService<R>(`${baseEndpoint}${path}`, { ...options, method: "GET" }),

    post: <R>(path: string, body: unknown, options?: ServiceOptions) =>
      fetchService<R>(`${baseEndpoint}${path}`, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      }),

    put: <R>(path: string, body: unknown, options?: ServiceOptions) =>
      fetchService<R>(`${baseEndpoint}${path}`, {
        ...options,
        method: "PUT",
        body: JSON.stringify(body),
      }),

    delete: <R>(path: string, options?: ServiceOptions) =>
      fetchService<R>(`${baseEndpoint}${path}`, { ...options, method: "DELETE" }),
  }
}