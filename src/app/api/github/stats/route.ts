import { NextResponse } from "next/server"
import { fetchGitHubStats } from "@/lib/api/github"

/**
 * Next.js API route to fetch real-time stats from GitHub.
 * Protects the GITHUB_TOKEN and performs backend data aggregation.
 */
export async function GET() {
  const username = "MythEclipse"

  try {
    const data = await fetchGitHubStats(username)
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch GitHub stats"
    console.error("API Route Error (GitHub Stats):", error)
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
