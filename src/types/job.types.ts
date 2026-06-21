export type JobSource = 'Greenhouse' | 'Lever' | 'Ashby' | 'LinkedIn' | 'Naukri'

export type JobStatus =
  | 'discovered'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'applied'

export interface MatchBreakdown {
  skillsMatch: number
  experienceMatch: number
  embeddingSimilarity: number
  geminiScore: number
}

export interface Job {
  id: string
  company: string
  role: string
  location: string
  source: JobSource
  matchScore: number
  status: JobStatus
  description: string
  applyUrl: string
  discoveredAt: string
  matchBreakdown: MatchBreakdown
  requiredSkills: string[]
  salary?: string
}

export interface DashboardStats {
  jobsScannedToday: number
  pendingApproval: number
  appliedThisWeek: number
  interviewRate: number
}

export interface DiscoverySource {
  name: JobSource
  status: 'healthy' | 'degraded' | 'offline'
  jobsFound: number
  lastSync: string
}

export interface MatchQueueItem {
  id: string
  company: string
  role: string
  matchScore: number
  status: JobStatus
  jobId: string
}

export interface JobSuggestionSummary {
  totalMatches: number
  topMatchScore: number
  companies: string[]
  resumeAnalyzed: boolean
  unlocked: boolean
}
