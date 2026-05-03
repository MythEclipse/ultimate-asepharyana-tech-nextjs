import { NextRequest, NextResponse } from "next/server"

interface CorsConfig {
  allowedOrigins?: string[]
  allowedMethods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
}

const DEFAULT_ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : []

const DEFAULT_CORS_CONFIG: CorsConfig = {
  allowedOrigins: DEFAULT_ALLOWED_ORIGINS.length > 0 ? DEFAULT_ALLOWED_ORIGINS : ["*"],
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-CSRF-Token"],
  exposedHeaders: ["X-Total-Count", "X-Page-Number", "X-RateLimit-Remaining"],
  credentials: true,
  maxAge: 86400,
}

export function createCorsMiddleware(config: CorsConfig = {}) {
  const {
    allowedOrigins = DEFAULT_CORS_CONFIG.allowedOrigins!,
    allowedMethods = DEFAULT_CORS_CONFIG.allowedMethods!,
    allowedHeaders = DEFAULT_CORS_CONFIG.allowedHeaders!,
    exposedHeaders = DEFAULT_CORS_CONFIG.exposedHeaders!,
    credentials = DEFAULT_CORS_CONFIG.credentials!,
    maxAge = DEFAULT_CORS_CONFIG.maxAge!,
  } = config

  return function corsMiddleware(req: NextRequest): NextResponse | null {
    const origin = req.headers.get("origin")

    if (req.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 204 })

      const allowedOrigin =
        allowedOrigins.includes("*") || !origin
          ? "*"
          : allowedOrigins.includes(origin)
            ? origin
            : null

      if (!allowedOrigin) {
        return response
      }

      response.headers.set("Access-Control-Allow-Origin", allowedOrigin)
      response.headers.set("Access-Control-Allow-Methods", allowedMethods.join(", "))
      response.headers.set("Access-Control-Allow-Headers", allowedHeaders.join(", "))
      response.headers.set("Access-Control-Allow-Credentials", String(credentials))
      response.headers.set("Access-Control-Max-Age", String(maxAge))

      if (exposedHeaders.length > 0) {
        response.headers.set("Access-Control-Expose-Headers", exposedHeaders.join(", "))
      }

      return response
    }

    const response = NextResponse.next()

    const allowedOrigin =
      allowedOrigins.includes("*") || !origin
        ? "*"
        : allowedOrigins.includes(origin)
          ? origin
          : null

    if (!allowedOrigin) {
      return response
    }

    response.headers.set("Access-Control-Allow-Origin", allowedOrigin)
    response.headers.set("Access-Control-Allow-Credentials", String(credentials))

    if (exposedHeaders.length > 0) {
      response.headers.set("Access-Control-Expose-Headers", exposedHeaders.join(", "))
    }

    return response
  }
}

export const defaultCorsMiddleware = createCorsMiddleware()