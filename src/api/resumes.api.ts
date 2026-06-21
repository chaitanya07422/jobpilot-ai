import { mockFetch } from '@/api/client'
import { isSubscribed } from '@/lib/pipeline'
import { useAuthStore } from '@/store/authStore'
import { mockResumes } from '@/mock/resumes'
import type { Resume } from '@/types/resume.types'

const DEFAULT_EXTRACTED_SKILLS = [
  'Go',
  'Python',
  'PostgreSQL',
  'Redis',
  'Kafka',
  'Microservices',
  'REST APIs',
  'Docker',
  'AWS',
]

const STORAGE_PREFIX = 'jobpilot-resumes'

function storageKey(): string {
  const userId = useAuthStore.getState().user?.id ?? 'guest'
  return `${STORAGE_PREFIX}:${userId}`
}

function loadResumes(): Resume[] {
  try {
    const raw = localStorage.getItem(storageKey())
    return raw ? (JSON.parse(raw) as Resume[]) : []
  } catch {
    return []
  }
}

function saveResumes(resumes: Resume[]) {
  localStorage.setItem(storageKey(), JSON.stringify(resumes))
}

let userResumes: Resume[] = loadResumes()

function syncFromStorage() {
  userResumes = loadResumes()
}

export function getUserResumeCount(): number {
  syncFromStorage()
  return userResumes.length
}

export function resetResumesData() {
  userResumes = []
  saveResumes([])
}

export function seedResumesData() {
  syncFromStorage()
  if (userResumes.length === 0) {
    userResumes = [...mockResumes]
    saveResumes(userResumes)
  }
}

export const resumesApi = {
  getAll: () => {
    syncFromStorage()
    if (isSubscribed() && userResumes.length === 0) {
      userResumes = [...mockResumes]
      saveResumes(userResumes)
    }
    return mockFetch<Resume[]>([...userResumes])
  },

  setPrimary: (id: string) => {
    syncFromStorage()
    userResumes = userResumes.map((r) => ({ ...r, isPrimary: r.id === id }))
    saveResumes(userResumes)
    return mockFetch([...userResumes])
  },

  upload: async (file: File) => {
    syncFromStorage()
    await new Promise((r) => setTimeout(r, 800))
    const newResume: Resume = {
      id: `resume-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      fileName: file.name,
      skillsExtracted: DEFAULT_EXTRACTED_SKILLS,
      uploadDate: new Date().toISOString(),
      isPrimary: userResumes.length === 0,
      fileSize: `${Math.round(file.size / 1024)} KB`,
    }
    userResumes = [...userResumes, newResume]
    saveResumes(userResumes)
    return mockFetch(newResume, { delay: 200 })
  },
}
