import { mockFetch } from '@/api/client'
import { isSubscribed } from '@/lib/pipeline'
import { mockActivities } from '@/mock/activities'
import { mockInsights } from '@/mock/insights'
import { emptyInsights } from '@/mock/empty'

export const activityApi = {
  getAll: () =>
    mockFetch(isSubscribed() ? [...mockActivities] : []),
}

export const insightsApi = {
  getAll: () =>
    mockFetch(isSubscribed() ? mockInsights : emptyInsights),
}
