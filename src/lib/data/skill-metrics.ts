// Type definitions only: these interfaces describe the shape of skill data
// without providing runtime payloads.
export interface SkillMetric {
  axis: string
  value: number // 0–1
  label: string
}

export interface SkillGroup {
  name: string
  color: string
  metrics: SkillMetric[]
}

/**
 * @deprecated Runtime data is no longer generated here.
 * Use live data from fetchGitHubStats() instead.
 * Static/Simulated data is preserved only for legacy compatibility.
 */
export const SKILL_RADAR_DATA: SkillMetric[] = []

/**
 * @deprecated Runtime data is no longer generated here.
 * Use live data from fetchGitHubStats() instead.
 */
export function generateActivityData(): { date: Date; count: number }[] {
  return []
}
