import { NextResponse } from "next/server"
import { fetchGitHubStats } from "@/lib/api/github"

/**
 * Next.js API route to fetch real-time stats from GitHub.
 * Protects the GITHUB_TOKEN and performs backend data aggregation.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const force = searchParams.get("force") === "true"
  const username = "MythEclipse"

  try {
    const data = await fetchGitHubStats(username, { forceFetch: force })
    return NextResponse.json(data, {
      status: 200,
      headers: {
        // Since we have a 12h cron job, we can set a long max-age but still allow revalidation
        "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=21600",
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch GitHub stats"
    console.error("API Route Error (GitHub Stats):", error)
    
    // Return a 200 with an error field so the UI can handle it gracefully
    return NextResponse.json(
      { 
        contributions: [], 
        totalContributions: 0, 
        languages: [], 
        error: message 
      },
      { status: 200 }
    )
  }
}
