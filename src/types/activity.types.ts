export type ActivityType =
  | 'discovery'
  | 'embedding'
  | 'search'
  | 'rerank'
  | 'application'
  | 'approval'
  | 'system'

export interface Activity {
  id: string
  type: ActivityType
  message: string
  timestamp: string
  metadata?: Record<string, string | number>
}

export interface SkillGap {
  skill: string
  frequency: number
  potentialIncrease: number
}

export interface CompanyInsight {
  company: string
  matchScore: number
  openRoles: number
  trend: 'up' | 'down' | 'stable'
}

export interface WeeklyMatchTrend {
  week: string
  matches: number
  applications: number
}

export interface InsightsData {
  missingSkills: SkillGap[]
  topCompanies: CompanyInsight[]
  weeklyTrend: WeeklyMatchTrend[]
  totalPotentialIncrease: number
}
