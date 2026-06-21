import { mockFetch } from '@/api/client'
import { mockPlans } from '@/mock/plans'
import type { PaymentRequest, PaymentResult, Plan, Subscription } from '@/types/subscription.types'

function buildSubscription(planId: PaymentRequest['planId']): Subscription {
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

export const paymentApi = {
  getPlans: () => mockFetch<Plan[]>(mockPlans),

  processPayment: (request: PaymentRequest) => {
    const cleaned = request.cardNumber.replace(/\s/g, '')
    if (cleaned.length < 16) {
      return mockFetch(null as unknown as PaymentResult, { shouldFail: true, delay: 600 })
    }
    if (request.cvv.length < 3) {
      return mockFetch(null as unknown as PaymentResult, { shouldFail: true, delay: 600 })
    }

    const result: PaymentResult = {
      success: true,
      transactionId: `txn_${Date.now()}`,
      subscription: buildSubscription(request.planId),
    }
    return mockFetch(result, { delay: 1500 })
  },
}
