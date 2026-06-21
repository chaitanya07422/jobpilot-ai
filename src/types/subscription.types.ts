export type PlanId = 'starter' | 'pro' | 'enterprise'

export interface Plan {
  id: PlanId
  name: string
  price: number
  currency: string
  interval: 'month'
  description: string
  features: string[]
  popular?: boolean
}

export interface Subscription {
  planId: PlanId
  active: boolean
  activatedAt: string
  expiresAt: string
}

export interface PaymentRequest {
  planId: PlanId
  cardNumber: string
  expiry: string
  cvv: string
  name: string
}

export interface PaymentResult {
  success: boolean
  transactionId: string
  subscription: Subscription
}
