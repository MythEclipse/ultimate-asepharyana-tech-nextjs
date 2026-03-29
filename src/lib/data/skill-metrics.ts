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

export const SKILL_RADAR_DATA: SkillMetric[] = [
  { axis: "Backend", value: 0.93, label: "93%" },
  { axis: "Frontend", value: 0.85, label: "85%" },
  { axis: "DevOps", value: 0.78, label: "78%" },
  { axis: "Database", value: 0.82, label: "82%" },
  { axis: "Performance", value: 0.88, label: "88%" },
  { axis: "Architecture", value: 0.80, label: "80%" },
  { axis: "Security", value: 0.72, label: "72%" },
  { axis: "Mobile", value: 0.65, label: "65%" },
]

// Simulated monthly commit-like activity for heatmap (52 weeks × 7 days)
export function generateActivityData(): { date: Date; count: number }[] {
  const data: { date: Date; count: number }[] = []
  const now = new Date()
  const start = new Date(now)
  start.setFullYear(now.getFullYear() - 1)

  for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
    // Higher density on weekdays, random with some bursts
    const isWeekday = d.getDay() > 0 && d.getDay() < 6
    const base = isWeekday ? Math.random() : Math.random() * 0.4
    const burst = Math.random() > 0.88 ? Math.random() * 0.7 : 0
    const count = Math.floor((base + burst) * 12)
    data.push({ date: new Date(d), count })
  }
  return data
}
