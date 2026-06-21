import { getUserResumeCount } from '@/api/resumes.api'
import { useAuthStore } from '@/store/authStore'

export function isSubscribed(): boolean {
  return useAuthStore.getState().subscription?.active === true
}

/** @deprecated use isSubscribed */
export function isPipelineActive(): boolean {
  return isSubscribed()
}

export function hasResumeUploaded(): boolean {
  return getUserResumeCount() > 0
}

export function canViewSuggestions(): boolean {
  return hasResumeUploaded()
}

export function canAutoApply(): boolean {
  return isSubscribed()
}
