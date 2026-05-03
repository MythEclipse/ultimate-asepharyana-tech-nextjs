import { describe, it, expect, vi, beforeEach } from "vitest"

import { cn } from "@/lib/utils"

describe("cn utility", () => {
  it("should combine class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("should handle conditional classes", () => {
    const condition = true
    expect(cn("foo", condition && "bar")).toBe("foo bar")
    expect(cn("foo", condition && "")).toBe("foo")
  })

  it("should handle array input", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar")
  })

  it("should handle object input", () => {
    expect(cn({ foo: true, bar: false })).toBe("foo")
  })
})

describe("fetchService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should sanitize response data", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        data: { name: "test", password: "secret123" },
      }),
    }

    vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response)

    const { fetchService } = await import("@/lib/services/base")

    const result = await fetchService("/test")

    expect(result).toEqual({
      data: { name: "test", password: "[REDACTED]" },
    })
  })
})