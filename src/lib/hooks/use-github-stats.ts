"use client"

import { useQuery } from "@tanstack/react-query"

import { type GitHubStatsResponse } from "@/lib/api/github"

const GITHUB_STATS_API = "/api/github/stats"

export function useGitHubStats() {
  return useQuery<GitHubStatsResponse>({
    queryKey: ["github-stats"],
    queryFn: async () => {
      const response = await fetch(GITHUB_STATS_API)
      if (!response.ok) {
        throw new Error(`Failed to load GitHub stats (${response.status})`)
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
