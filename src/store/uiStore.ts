import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface JobPreferences {
  preferredRoles: string[]
  preferredLocations: string[]
  minimumMatchScore: number
  autoApply: boolean
}

interface SourceConfig {
  greenhouse: boolean
  lever: boolean
  ashby: boolean
  linkedin: boolean
  naukri: boolean
}

interface UIState {
  sidebarOpen: boolean
  automationPaused: boolean
  telegramConnected: boolean
  jobPreferences: JobPreferences
  sourceConfig: SourceConfig
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleAutomation: () => void
  setJobPreferences: (prefs: Partial<JobPreferences>) => void
  setSourceConfig: (config: Partial<SourceConfig>) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      automationPaused: true,
      telegramConnected: false,
      jobPreferences: {
        preferredRoles: [
          'Backend Engineer',
          'Senior Backend Engineer',
          'Staff Backend Engineer',
          'Platform Engineer',
        ],
        preferredLocations: ['Bangalore', 'Remote'],
        minimumMatchScore: 75,
        autoApply: false,
      },
      sourceConfig: {
        greenhouse: true,
        lever: true,
        ashby: true,
        linkedin: true,
        naukri: true,
      },

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleAutomation: () => set((s) => ({ automationPaused: !s.automationPaused })),
      setJobPreferences: (prefs) =>
        set((s) => ({ jobPreferences: { ...s.jobPreferences, ...prefs } })),
      setSourceConfig: (config) =>
        set((s) => ({ sourceConfig: { ...s.sourceConfig, ...config } })),
    }),
    { name: 'jobpilot-ui' },
  ),
)
