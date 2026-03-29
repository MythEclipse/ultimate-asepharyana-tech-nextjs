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
 * @deprecated Use live data from fetchGitHubStats() instead.
 * Static/Simulated data is no longer the source of truth to ensure 
 * adherence to "Strictly Public GitHub Data" requirements.
 */
export const SKILL_RADAR_DATA: SkillMetric[] = []

/**
 * @deprecated Use live data from fetchGitHubStats() instead.
 */
export function generateActivityData(): { date: Date; count: number }[] {
  return []
}
