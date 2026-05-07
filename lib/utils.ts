import { clsx, type ClassValue } from "clsx"

import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiUrl(path: string = "") {
  // Use a consistent approach to avoid hydration mismatches
  const getBaseUrl = () => {
    // Check if we're in the browser
    if (typeof globalThis.window !== "undefined") {
      return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
    }
    // Server-side fallback
    return "http://localhost:5000"
  }

  const baseUrl = getBaseUrl()
  return `${baseUrl}${path}`
}
