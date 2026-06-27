import type { ExtractionStatus } from '@/types/resume.types'

export function parseCommaList(value: string): string[] {
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))]
}

export function parseLineList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function extractionStatusLabel(status?: ExtractionStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'processing':
      return 'Extracting'
    case 'ready_for_review':
      return 'Review required'
    case 'confirmed':
      return 'Confirmed'
    case 'failed':
      return 'Extraction failed'
    default:
      return 'Unknown'
  }
}

export function extractionStatusVariant(
  status?: ExtractionStatus,
): 'cyan' | 'green' | 'amber' | 'red' | 'muted' {
  switch (status) {
    case 'confirmed':
      return 'green'
    case 'ready_for_review':
      return 'amber'
    case 'failed':
      return 'red'
    case 'processing':
    case 'pending':
      return 'cyan'
    default:
      return 'muted'
  }
}
