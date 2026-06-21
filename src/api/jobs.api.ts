import { mockFetch } from '@/api/client'
import { isSubscribed } from '@/lib/pipeline'
import {
  featuredMatchJob,
  mockDashboardStats,
  mockDiscoverySources,
  mockJobs,
  mockMatchQueue,
} from '@/mock/jobs'
import { emptyDashboardStats, emptyDiscoverySources } from '@/mock/empty'
import type {
  DashboardStats,
  DiscoverySource,
  Job,
  JobSource,
  JobStatus,
  MatchQueueItem,
} from '@/types/job.types'

export interface JobFilters {
  search?: string
  status?: JobStatus | 'all'
  minScore?: number
  source?: JobSource | 'all'
}

function filterJobs(jobs: Job[], filters?: JobFilters) {
  return jobs.filter((job) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matches =
        job.company.toLowerCase().includes(q) ||
        job.role.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      if (!matches) return false
    }
    if (filters?.status && filters.status !== 'all' && job.status !== filters.status) {
      return false
    }
    if (filters?.minScore && job.matchScore < filters.minScore) {
      return false
    }
    if (filters?.source && filters.source !== 'all' && job.source !== filters.source) {
      return false
    }
    return true
  })
}

export const jobsApi = {
  getAll: (filters?: JobFilters) => {
    if (!isSubscribed()) return mockFetch<Job[]>([])
    return mockFetch(filterJobs(mockJobs, filters))
  },

  getById: (id: string) => {
    if (!isSubscribed()) {
      return mockFetch(null as unknown as Job, { shouldFail: true })
    }
    const job = mockJobs.find((j) => j.id === id)
    if (!job) return mockFetch(null as unknown as Job, { shouldFail: true })
    return mockFetch(job)
  },

  getDashboardStats: () =>
    mockFetch<DashboardStats>(
      isSubscribed() ? mockDashboardStats : emptyDashboardStats,
    ),

  getMatchQueue: () =>
    mockFetch<MatchQueueItem[]>(isSubscribed() ? mockMatchQueue : []),

  getDiscoverySources: () =>
    mockFetch<DiscoverySource[]>(
      isSubscribed() ? mockDiscoverySources : emptyDiscoverySources,
    ),

  getFeaturedMatch: () => {
    if (!isSubscribed()) return mockFetch<Job | null>(null)
    return mockFetch(featuredMatchJob)
  },

  approve: (id: string) =>
    mockFetch({ id, status: 'approved' as const }),

  reject: (id: string) =>
    mockFetch({ id, status: 'rejected' as const }),
}
