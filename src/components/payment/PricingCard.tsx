import { Check } from 'lucide-react'
import type { Plan } from '@/types/subscription.types'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface PricingCardProps {
  plan: Plan
  onSelect: (plan: Plan) => void
  currentPlanId?: string
}

export function PricingCard({ plan, onSelect, currentPlanId }: PricingCardProps) {
  const isCurrent = currentPlanId === plan.id

  return (
    <Card
      className={cn(
        'relative flex flex-col',
        plan.popular && 'border-cyan/40 shadow-lg shadow-cyan/5',
        isCurrent && 'border-green/40',
      )}
    >
      {plan.popular && (
        <Badge variant="cyan" className="absolute -top-2.5 left-4">
          Most Popular
        </Badge>
      )}
      {isCurrent && (
        <Badge variant="green" className="absolute -top-2.5 right-4">
          Current Plan
        </Badge>
      )}

      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>

      <div className="mb-6">
        <span className="font-mono text-3xl font-bold">₹{plan.price.toLocaleString('en-IN')}</span>
        <span className="text-sm text-muted">/{plan.interval}</span>
      </div>

      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-green shrink-0 mt-0.5" />
            <span className="text-muted">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={plan.popular ? 'default' : 'outline'}
        className="w-full"
        disabled={isCurrent}
        onClick={() => onSelect(plan)}
      >
        {isCurrent ? 'Active Plan' : `Subscribe to ${plan.name}`}
      </Button>
    </Card>
  )
}
