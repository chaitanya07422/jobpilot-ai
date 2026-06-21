import type { Plan } from '@/types/subscription.types'

export const mockPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 999,
    currency: 'INR',
    interval: 'month',
    description: 'Perfect for getting started with AI job matching',
    features: [
      'Up to 50 job scans / day',
      '1 resume variant',
      'Basic match scoring',
      'Email notifications',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2499,
    currency: 'INR',
    interval: 'month',
    description: 'Full automation for serious job seekers',
    features: [
      'Unlimited job scans',
      '3 resume variants',
      'Gemini re-ranking',
      'Telegram approvals',
      'Auto-apply',
      'AI insights',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999,
    currency: 'INR',
    interval: 'month',
    description: 'Advanced pipeline for power users',
    features: [
      'Everything in Pro',
      'Priority source scanning',
      'Custom match thresholds',
      'Dedicated support',
      'API access',
    ],
  },
]
