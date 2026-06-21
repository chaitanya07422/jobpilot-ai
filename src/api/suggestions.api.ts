import { mockFetch } from '@/api/client'
import { hasResumeUploaded, isSubscribed } from '@/lib/pipeline'
import { mockJobs } from '@/mock/jobs'
import type { Job, JobSuggestionSummary } from '@/types/job.types'

export function getSuggestions(): Job[] {
  if (!hasResumeUploaded()) return []
  return [...mockJobs].sort((a, b) => b.matchScore - a.matchScore).slice(0, 8)
}

export const suggestionsApi = {
  getForResume: () => {
    const jobs = getSuggestions()
    return mockFetch(jobs, { delay: 600 })
  },

  getSummary: () => {
    const jobs = getSuggestions()
    const summary: JobSuggestionSummary = {
      totalMatches: jobs.length,
      topMatchScore: jobs[0]?.matchScore ?? 0,
      companies: jobs.map((j) => j.company),
      resumeAnalyzed: hasResumeUploaded(),
      unlocked: isSubscribed(),
    }
    return mockFetch(summary, { delay: 300 })
  },
}
