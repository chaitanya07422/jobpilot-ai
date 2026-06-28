import { apiFetch, apiUpload } from '@/api/client'
import { sessionToken } from '@/lib/session-token'
import type { Resume, ResumeProfile, ResumeQuota, UpdateResumeProfilePayload } from '@/types/resume.types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

let cachedResumeCount = 0

export function setCachedResumeCount(count: number): void {
  cachedResumeCount = count
}

export function getUserResumeCount(): number {
  return cachedResumeCount
}

export function buildResumeFileUrl(resumeId: string): string {
  return `${API_URL}/api/v1/resumes/${resumeId}/file`
}

export const resumesApi = {
  getAll: async () => {
    const resumes = await apiFetch<Resume[]>('/resumes')
    setCachedResumeCount(resumes.length)
    return resumes
  },

  getProfile: () => apiFetch<ResumeProfile>('/resumes/profile'),

  getQuota: () => apiFetch<ResumeQuota>('/resumes/quota'),

  updateProfile: (payload: UpdateResumeProfilePayload) =>
    apiFetch<ResumeProfile>('/resumes/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  confirmProfile: (payload?: UpdateResumeProfilePayload) =>
    apiFetch<ResumeProfile>('/resumes/profile/confirm', {
      method: 'POST',
      body: JSON.stringify(payload ?? {}),
    }),

  upload: async (file: File) => {
    const resume = await apiUpload<Resume>('/resumes/upload', file)
    setCachedResumeCount(1)
    return resume
  },

  delete: async (id: string) => {
    await apiFetch<null>(`/resumes/${id}`, { method: 'DELETE' })
    setCachedResumeCount(0)
  },

  openFile: async (resume: Resume) => {
    const token = sessionToken.get()
    const url = resume.url.startsWith('http') ? resume.url : buildResumeFileUrl(resume.id)
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error('Could not open resume file')
    }

    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    window.open(objectUrl, '_blank', 'noopener,noreferrer')
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
  },
}
