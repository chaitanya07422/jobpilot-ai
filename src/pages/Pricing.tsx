import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Sparkles, FlaskConical } from 'lucide-react'
import { paymentApi } from '@/api/payment.api'
import { useAuthStore } from '@/store/authStore'
import { activateDemoSubscription } from '@/lib/activatePipeline'
import { PricingCard } from '@/components/payment/PricingCard'
import { MockPaymentModal } from '@/components/payment/MockPaymentModal'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/EmptyState'
import type { Plan } from '@/types/subscription.types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const subscription = useAuthStore((s) => s.subscription)
  const queryClient = useQueryClient()

  const { data: plans, isLoading, isError, refetch } = useQuery({
    queryKey: ['plans'],
    queryFn: paymentApi.getPlans,
  })

  const handleSelect = (plan: Plan) => {
    setSelectedPlan(plan)
    setPaymentOpen(true)
  }

  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries()
  }

  const handleDemoSubscribe = async () => {
    setDemoLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    activateDemoSubscription('pro')
    queryClient.invalidateQueries()
    setDemoLoading(false)
  }

  if (isLoading) return <PageLoader />
  if (isError || !plans) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-cyan" />
          {subscription?.active && (
            <Badge variant="green">Subscribed — {subscription.planId}</Badge>
          )}
        </div>
        <h2 className="font-heading text-2xl font-bold">Unlock auto-apply</h2>
        <p className="text-sm text-muted mt-2 max-w-lg mx-auto">
          You&apos;ve seen your job matches. Subscribe to unlock full job details, company names,
          apply links, and automated applications.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSelect={handleSelect}
            currentPlanId={subscription?.active ? subscription.planId : undefined}
          />
        ))}
      </div>

      {!subscription?.active && (
        <Card className="border-dashed border-amber/30 bg-amber/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 border border-amber/20 shrink-0">
                <FlaskConical className="h-5 w-5 text-amber" />
              </div>
              <div>
                <p className="text-sm font-medium">Demo mode</p>
                <p className="text-xs text-muted mt-0.5">
                  Skip payment and activate Pro — replace with real billing later
                </p>
              </div>
            </div>
            <Button
              variant="amber"
              loading={demoLoading}
              onClick={handleDemoSubscribe}
              className="w-full sm:w-auto shrink-0"
            >
              Demo Subscribe
            </Button>
          </div>
        </Card>
      )}

      <MockPaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        plan={selectedPlan}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
