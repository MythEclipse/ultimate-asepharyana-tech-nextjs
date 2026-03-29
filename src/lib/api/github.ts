import { type SkillMetric } from "../data/skill-metrics"

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

/**
 * GraphQL Query to fetch contribution calendar (1 year) 
 * and repository language statistics in a single batch.
 */
const GITHUB_STATS_QUERY = `
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
}
`

export interface GitHubContribution {
  date: string
  count: number
}

export interface GitHubStatsResponse {
  contributions: GitHubContribution[]
  totalContributions: number
  languages: SkillMetric[]
}

/**
 * Fetches real statistics from GitHub for a specific user.
 * "Token-Optional": Tries GraphQL for full data if GITHUB_TOKEN exists,
 * otherwise falls back to Public REST API with aggressive caching.
 */
export async function fetchGitHubStats(username: string): Promise<GitHubStatsResponse> {
  const token = process.env.GITHUB_TOKEN

  if (token) {
    try {
      return await fetchGitHubGraphQLStats(username, token)
    } catch (err) {
      console.warn("GraphQL fetch failed, falling back to REST:", err)
    }
  }

  return await fetchGitHubRESTStats(username)
}

async function fetchGitHubGraphQLStats(username: string, token: string): Promise<GitHubStatsResponse> {
  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: GITHUB_STATS_QUERY,
      variables: { username },
    }),
    next: { revalidate: 3600 } // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error(`GitHub GraphQL API error: ${response.status}`)
  }

  const result = await response.json()
  if (result.errors) throw new Error(result.errors[0].message)

  const userData = result.data.user
  if (!userData) throw new Error("User not found")

  interface CalendarNode {
    totalContributions: number
    weeks: { contributionDays: { date: string; contributionCount: number }[] }[]
  }
  const calendar = userData.contributionsCollection.contributionCalendar as CalendarNode
  const contributions: GitHubContribution[] = calendar.weeks.flatMap((week: { contributionDays: { date: string; contributionCount: number }[] }) =>
    week.contributionDays.map((day: { date: string; contributionCount: number }) => ({
      date: day.date,
      count: day.contributionCount,
    }))
  )

  const langMap = new Map<string, number>()
  let totalBytes = 0

  userData.repositories.nodes.forEach((repo: { languages: { edges: { size: number; node: { name: string; color: string } }[] } }) => {
    repo.languages.edges.forEach((edge: { node: { name: string; color: string }; size: number }) => {
      const name = edge.node.name
      const size = edge.size
      langMap.set(name, (langMap.get(name) || 0) + size)
      totalBytes += size
    })
  })

  return {
    contributions,
    totalContributions: calendar.totalContributions,
    languages: processLanguages(langMap, totalBytes),
  }
}

async function fetchGitHubRESTStats(username: string): Promise<GitHubStatsResponse> {
  // 1. Fetch Repos for Language Stats
  const repoRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      next: { revalidate: 3600 }
  })
  
  if (!repoRes.ok) throw new Error(`Public REST API error: ${repoRes.status}`)
  const repos = await repoRes.json()

  const langMap = new Map<string, number>()
  let totalBytes = 0

  interface GitHubRepo {
    language: string | null
    size: number
  }

  // Public REST only gives 'language' (main) easily. 
  // For a "no-token" scenario, we aggregate by repo main language.
  (repos as GitHubRepo[]).forEach((repo) => {
      if (repo.language) {
          langMap.set(repo.language, (langMap.get(repo.language) || 0) + (repo.size || 100))
          totalBytes += (repo.size || 100)
      }
  })

  // 2. Fetch Events for Heatmap (Last 90 days fallback)
  const eventRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
      next: { revalidate: 3600 }
  })
  
  const contributions: GitHubContribution[] = []
  if (eventRes.ok) {
      const events = await eventRes.json()
      const counts = new Map<string, number>()
      
      events.forEach((ev: { created_at: string }) => {
          const date = ev.created_at.split("T")[0]
          counts.set(date, (counts.get(date) || 0) + 1)
      })

      counts.forEach((count, date) => {
          contributions.push({ date, count })
      })
  }

  return {
    contributions: contributions.sort((a,b) => a.date.localeCompare(b.date)),
    totalContributions: contributions.length,
    languages: processLanguages(langMap, totalBytes),
  }
}

function processLanguages(langMap: Map<string, number>, totalBytes: number): SkillMetric[] {
  const sortedLangs = Array.from(langMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  const maxByte = sortedLangs[0]?.[1] || 1

  return sortedLangs.map(([name, size]) => ({
    axis: name,
    value: Number((size / maxByte).toFixed(2)),
    label: `${Math.round((size / totalBytes) * 100)}%`,
  }))
}

