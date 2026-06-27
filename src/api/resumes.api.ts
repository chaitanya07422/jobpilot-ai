import { apiFetch, apiUpload } from '@/api/client'
import { sessionToken } from '@/lib/session-token'
import type { Resume } from '@/types/resume.types'

let cachedResumeCount = 0

export function setCachedResumeCount(count: number): void {
  cachedResumeCount = count
}

export function getUserResumeCount(): number {
  return cachedResumeCount
}

export const resumesApi = {
  getAll: async () => {
    const resumes = await apiFetch<Resume[]>('/resumes')
    setCachedResumeCount(resumes.length)
    return resumes
  },

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
    const res = await fetch(resume.url, {
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
