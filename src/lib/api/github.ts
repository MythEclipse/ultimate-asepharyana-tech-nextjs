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
  language: string | null
  size: number
}

/**
 * Fetches real statistics from GitHub for a specific user.
 * "STRICTLY PUBLIC": No API key/token required.
 */
export async function fetchGitHubStats(username: string): Promise<GitHubStatsResponse> {
  try {
    const [repos, contributions] = await Promise.all([
      fetchPublicRepos(username),
      fetchPublicContributions(username)
    ])

    const langMap = new Map<string, number>();
    let totalBytes = 0;

    const repositoryList = repos as GitHubRepo[];
    repositoryList.forEach((repo) => {
      if (repo.language) {
        // Public API only gives 'language' easily per repo info.
        // We use repo size as weight to approximate language distribution.
        const size = repo.size || 100
        langMap.set(repo.language, (langMap.get(repo.language) || 0) + size)
        totalBytes += size
      }
    })

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
  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    next: { revalidate: 86400 }
  })
  
  if (!response.ok) {
    if (response.status === 403) throw new Error("GitHub Public Rate Limit Exceeded (60 req/hr)")
    throw new Error(`Public Repo API error: ${response.status}`)
  }
  return await response.json()
}

/**
 * Scrapes the public contribution calendar fragment from github.com.
 * Returns 1 year of data without requiring an API key.
 */
async function fetchPublicContributions(username: string): Promise<{ data: GitHubContribution[], total: number }> {
  const url = `https://github.com/users/${username}/contributions`
  const response = await fetch(url, { next: { revalidate: 86400 } })
  
  if (!response.ok) throw new Error(`Public Contribution Scraper error: ${response.status}`)
  
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
    data: contributions.sort((a,b) => a.date.localeCompare(b.date)), 
    total 
  }
}

async function fetchPublicEventsFallback(username: string): Promise<{ data: GitHubContribution[], total: number }> {
  const res = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
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

