import { mockFetch } from '@/api/client'
import { isSubscribed } from '@/lib/pipeline'
import { mockApplications } from '@/mock/applications'
import type { Application, ApplicationStage } from '@/types/application.types'

let applications = [...mockApplications]

export function resetApplicationsData() {
  applications = [...mockApplications]
}

export const applicationsApi = {
  getAll: () =>
    mockFetch<Application[]>(isSubscribed() ? [...applications] : []),

  updateStage: (id: string, stage: ApplicationStage) => {
    if (!isSubscribed()) {
      return mockFetch(null as unknown as Application, { shouldFail: true })
    }
    applications = applications.map((app) =>
      app.id === id ? { ...app, stage, updatedAt: new Date().toISOString() } : app,
    )
    const updated = applications.find((a) => a.id === id)
    return mockFetch(updated!)
  },

  getByStage: (stage: ApplicationStage) =>
    mockFetch(
      isSubscribed() ? applications.filter((a) => a.stage === stage) : [],
    ),
}
