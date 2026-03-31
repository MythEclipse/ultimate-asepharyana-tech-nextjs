import { type SkillMetric } from "../data/skill-metrics"

export interface GitHubContribution {
  date: string
  count: number
}

export interface GitHubStatsResponse {
  contributions: GitHubContribution[]
  totalContributions: number
  languages: SkillMetric[]
  error?: string
}

interface GitHubRepo {
  name: string
  full_name: string
  language: string | null
  size: number
  languages_url: string
}

function getGitHubHeaders() {
  const token = process.env.GITHUB_TOKEN || ""
  const headers: Record<string, string> = {
    "Accept": "application/vnd.github.v3+json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

const GITHUB_STATS_URL = "https://raw.githubusercontent.com/MythEclipse/ultimate-asepharyana-tech-nextjs/refs/heads/main/src/lib/data/github-stats.json"

/**
 * Fetches statistics from GitHub.
 * Prioritizes the remote raw JSON from the main branch to ensure the latest data is shown
 * immediately after the cron job runs without requiring a redeploy.
 */
export async function fetchGitHubStats(username: string, options: { forceFetch?: boolean } = {}): Promise<GitHubStatsResponse> {
  // Attempt to use cached data first unless forcing a fetch
  if (!options.forceFetch) {
    // 1. Try remote raw URL for latest data
    try {
      const response = await fetch(GITHUB_STATS_URL, { 
        next: { revalidate: 3600 } // Check for updates at most once per hour
      })
      if (response.ok) {
        return await response.json()
      }
    } catch (err) {
      console.warn("Failed to fetch remote GitHub stats, falling back to local cache", err)
    }

    // 2. Try local build-time import as secondary fallback
    try {
      // Use dynamic import to avoid build errors if the file doesn't exist yet
      const cached = await import("../data/github-stats.json")
      if (cached && cached.default) {
        return cached.default as GitHubStatsResponse
      }
    } catch (err) {
      console.warn("Local cached GitHub stats not found or invalid", err)
    }
  }

  try {
    const [repos, contributions] = await Promise.all([
      fetchPublicRepos(username),
      fetchGitHubContributions(username),
    ])

    const repositoryList = repos as GitHubRepo[]

    const langMap = new Map<string, number>()
    let totalBytes = 0

    // Prefer per-repo /languages endpoint to get accurate byte counts.
    // Fall back to the repo.language heuristics when GitHub rate limiting occurs.
    try {
      const languageDetails = await fetchRepoLanguages(repositoryList)
      languageDetails.forEach((bytes, lang) => {
        langMap.set(lang, (langMap.get(lang) || 0) + bytes)
        totalBytes += bytes
      })
    } catch (error) {
      console.warn("Repo language details unavailable, falling back to topology estimate", error)
      repositoryList.forEach((repo) => {
        if (repo.language) {
          const size = repo.size || 100
          langMap.set(repo.language, (langMap.get(repo.language) || 0) + size)
          totalBytes += size
        }
      })
    }

    return {
      contributions: contributions.data,
      totalContributions: contributions.total,
      languages: processLanguages(langMap, totalBytes),
    }
  } catch (err) {
    console.error("Public GitHub Fetch Error:", err)
    throw err
  }
}

/**
 * Fetches public repositories for language distribution stats.
 */
async function fetchPublicRepos(username: string) {
  const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
  const headers = getGitHubHeaders()

  const response = await fetch(url, {
    headers,
    next: { revalidate: 86400 },
  })

  if (!response.ok) {
    if (response.status === 403) {
      const message = await response.text()
      console.error("GitHub rate limit reached in fetchPublicRepos", message)
      throw new Error("GitHub Rate Limit Exceeded")
    }
    throw new Error(`Public Repo API error: ${response.status}`)
  }

  const data = await response.json()
  if (!Array.isArray(data)) {
    console.warn("fetchPublicRepos expected array but got", data)
    throw new Error("Unexpected GitHub repos response")
  }

  return data
}

async function fetchRepoLanguages(repos: GitHubRepo[]): Promise<Map<string, number>> {
  const langMap = new Map<string, number>()
  const headers = getGitHubHeaders()

  const requests = repos.map(async (repo) => {
    if (!repo.languages_url) return

    try {
      const resp = await fetch(repo.languages_url, {
        headers,
        next: { revalidate: 86400 },
      })



      if (!resp.ok) {
        return
      }

      const obj = (await resp.json()) as Record<string, number>
      Object.entries(obj).forEach(([lang, bytes]) => {
        langMap.set(lang, (langMap.get(lang) || 0) + bytes)
      })
    } catch (error) {
      console.warn(`Failed fetching languages for ${repo.full_name}`, error);
    }
  })

  await Promise.all(requests)
  return langMap
}

/**
 * Fetches GitHub contribution data using GraphQL contributionsCollection.
 */
async function fetchGitHubContributions(username: string): Promise<{ data: GitHubContribution[]; total: number }> {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    // fallback to public contributions / events if token is absent
    console.warn("GITHUB_TOKEN not set, falling back to public contributions scraper")
    return fetchPublicContributions(username)
  }

  const to = new Date()
  const from = new Date(to)
  from.setFullYear(to.getFullYear() - 1)

  const fromIso = from.toISOString()
  const toIso = to.toISOString()

  const graphql = {
    query: `
      query ContributionsCollection($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      login: username,
      from: fromIso,
      to: toIso,
    },
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(graphql),
    next: { revalidate: 86400 },
  })

  const json = await response.json()

  if (!response.ok || json.errors) {
    console.warn("GitHub GraphQL contributions fetch failed", {
      status: response.status,
      errors: json.errors,
      message: json.message,
    })
    return fetchPublicContributions(username)
  }

  const days: GitHubContribution[] = []
  const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks as { contributionDays: { date: string; contributionCount: number }[] }[] || []

  weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      days.push({
        date: day.date,
        count: day.contributionCount,
      })
    })
  })

  const sorted = days.sort((a, b) => a.date.localeCompare(b.date))
  const total = json.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0

  return { data: sorted, total }
}

/**
 * Scrapes the public contribution calendar fragment from github.com.
 * Returns 1 year of data without requiring an API key.
 */
async function fetchPublicContributions(username: string): Promise<{ data: GitHubContribution[]; total: number }> {
  const url = `https://github.com/users/${username}/contributions`
  const headers = getGitHubHeaders()



  const response = await fetch(url, {
    headers,
    next: { revalidate: 86400 },
  })

  if (!response.ok) {
    const msg = await response.text()
    console.warn("Public Contribution Scraper failed", { status: response.status, msg })
    if (response.status === 429 || response.status === 403) {
      return fetchPublicEventsFallback(username)
    }
    throw new Error(`Public Contribution Scraper error: ${response.status}`)
  }

  const html = await response.text()
  const contributions: GitHubContribution[] = []
  let total = 0

  // Standard regex for extracting data-date and data-count/level from the SVG/rect elements
  // Note: Modern GitHub contribution fragment uses <tool-tip> or <rect> with data-date and data-count
  const dateRegex = /data-date="(\d{4}-\d{2}-\d{2})"/g
  const countRegex = /data-count="(\d+)"/g

  // We find matches for both date and count in the HTML fragment
  let dateMatch
  const dates: string[] = []
  while ((dateMatch = dateRegex.exec(html)) !== null) {
    dates.push(dateMatch[1])
  }

  let countMatch
  const counts: number[] = []
  while ((countMatch = countRegex.exec(html)) !== null) {
    counts.push(parseInt(countMatch[1], 10))
  }

  // Combine them
  for (let i = 0; i < Math.min(dates.length, counts.length); i++) {
    contributions.push({ date: dates[i], count: counts[i] })
    total += counts[i]
  }

  // If scraper fails to find elements (Github changed UI), fallback to public events (last 90d)
  if (contributions.length === 0) {
    console.warn("Public scraper found no data, falling back to public events API")
    return await fetchPublicEventsFallback(username)
  }

  return {
    data: contributions.sort((a, b) => a.date.localeCompare(b.date)),
    total,
  }
}

async function fetchPublicEventsFallback(username: string): Promise<{ data: GitHubContribution[], total: number }> {
  const url = `https://api.github.com/users/${username}/events/public?per_page=100`
  const headers = getGitHubHeaders()

  const res = await fetch(url, {
      headers,
      next: { revalidate: 86400 }
  })

  const contributions: GitHubContribution[] = []
  if (res.ok) {
      const events = await res.json() as { created_at: string }[]
      const counts = new Map<string, number>()
      events.forEach((ev) => {
          const date = ev.created_at.split("T")[0]
          counts.set(date, (counts.get(date) || 0) + 1)
      })
      counts.forEach((count, date) => contributions.push({ date, count }))
  }

  return {
    data: contributions.sort((a,b) => a.date.localeCompare(b.date)),
    total: contributions.length
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

