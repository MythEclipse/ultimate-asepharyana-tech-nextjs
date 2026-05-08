import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely converts a Tailwind text color class to a background color class
 * Example: "text-primary" -> "bg-primary"
 */
export function textToBgClass(textColorClass: string): string {
  if (!textColorClass) return "bg-primary"
  return textColorClass.replace("text-", "bg-")
}
