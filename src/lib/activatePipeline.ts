import { resetApplicationsData } from '@/api/applications.api'
import { useAuthStore } from '@/store/authStore'
import type { PlanId, Subscription } from '@/types/subscription.types'

export function buildSubscription(planId: PlanId = 'pro'): Subscription {
  const now = new Date()
  const expires = new Date(now)
  expires.setMonth(expires.getMonth() + 1)
  return {
    planId,
    active: true,
    activatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  }
}

export function activatePipeline(subscription: Subscription) {
  useAuthStore.getState().activateSubscription(subscription)
  resetApplicationsData()
}

/** Demo-only — bypasses payment until real billing is integrated */
export function activateDemoSubscription(planId: PlanId = 'pro') {
  activatePipeline(buildSubscription(planId))
}
