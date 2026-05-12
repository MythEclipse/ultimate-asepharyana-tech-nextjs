export const THEME_SEQUENCE = ["light", "dark", "system"] as const
export type Theme = (typeof THEME_SEQUENCE)[number]
