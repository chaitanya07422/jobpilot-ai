import type { DashboardStats, DiscoverySource } from '@/types/job.types'
import type { InsightsData } from '@/types/activity.types'

export const emptyDashboardStats: DashboardStats = {
  jobsScannedToday: 0,
  pendingApproval: 0,
  appliedThisWeek: 0,
  interviewRate: 0,
}

export const emptyDiscoverySources: DiscoverySource[] = [
  { name: 'Greenhouse', status: 'offline', jobsFound: 0, lastSync: '' },
  { name: 'Lever', status: 'offline', jobsFound: 0, lastSync: '' },
  { name: 'Ashby', status: 'offline', jobsFound: 0, lastSync: '' },
  { name: 'LinkedIn', status: 'offline', jobsFound: 0, lastSync: '' },
  { name: 'Naukri', status: 'offline', jobsFound: 0, lastSync: '' },
]

export const emptyInsights: InsightsData = {
  missingSkills: [],
  topCompanies: [],
  weeklyTrend: [],
  totalPotentialIncrease: 0,
}
