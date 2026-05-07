import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiUrl(path: string = "") {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
  console.log(baseUrl, path)

  return `${baseUrl}${path}`
}
