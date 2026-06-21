import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green'
  if (score >= 80) return 'text-cyan'
  if (score >= 70) return 'text-amber'
  return 'text-red'
}

export function getScoreBg(score: number): string {
  if (score >= 90) return 'bg-green/10 text-green border-green/20'
  if (score >= 80) return 'bg-cyan/10 text-cyan border-cyan/20'
  if (score >= 70) return 'bg-amber/10 text-amber border-amber/20'
  return 'bg-red/10 text-red border-red/20'
}
