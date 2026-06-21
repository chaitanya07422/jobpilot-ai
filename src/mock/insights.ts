import type { InsightsData } from '@/types/activity.types'

export const mockInsights: InsightsData = {
  missingSkills: [
    { skill: 'Kafka', frequency: 34, potentialIncrease: 12 },
    { skill: 'AWS', frequency: 28, potentialIncrease: 9 },
    { skill: 'Kubernetes', frequency: 22, potentialIncrease: 8 },
    { skill: 'C++', frequency: 15, potentialIncrease: 5 },
    { skill: 'Terraform', frequency: 12, potentialIncrease: 4 },
  ],
  topCompanies: [
    { company: 'Zerodha', matchScore: 94, openRoles: 3, trend: 'up' },
    { company: 'Razorpay', matchScore: 91, openRoles: 2, trend: 'up' },
    { company: 'PhonePe', matchScore: 86, openRoles: 2, trend: 'stable' },
    { company: 'Sarvam AI', matchScore: 85, openRoles: 2, trend: 'up' },
    { company: 'Groww', matchScore: 82, openRoles: 1, trend: 'stable' },
    { company: 'Swiggy', matchScore: 78, openRoles: 1, trend: 'down' },
  ],
  weeklyTrend: [
    { week: 'May 26', matches: 42, applications: 8 },
    { week: 'Jun 2', matches: 58, applications: 11 },
    { week: 'Jun 9', matches: 71, applications: 14 },
    { week: 'Jun 16', matches: 89, applications: 12 },
    { week: 'Jun 23', matches: 95, applications: 6 },
  ],
  totalPotentialIncrease: 23,
}
