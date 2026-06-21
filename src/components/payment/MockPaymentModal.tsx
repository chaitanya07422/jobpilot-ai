import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import type { Plan } from '@/types/subscription.types'
import { paymentApi } from '@/api/payment.api'
import { activatePipeline } from '@/lib/activatePipeline'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface MockPaymentModalProps {
  open: boolean
  onClose: () => void
  plan: Plan | null
  onSuccess: () => void
}

export function MockPaymentModal({ open, onClose, plan, onSuccess }: MockPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111')
  const [expiry, setExpiry] = useState('12/28')
  const [cvv, setCvv] = useState('123')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: paymentApi.processPayment,
    onSuccess: (result) => {
      activatePipeline(result.subscription)
      onSuccess()
      onClose()
      setError('')
    },
    onError: () => setError('Payment failed. Check card details and try again.'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!plan) return
    setError('')
    mutation.mutate({ planId: plan.id, cardNumber, expiry, cvv, name })
  }

  const formatCard = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  if (!plan) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Complete Payment"
      description={`Subscribe to ${plan.name} — ₹${plan.price.toLocaleString('en-IN')}/month`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-panel-secondary border border-border p-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{plan.name} Plan</p>
            <p className="text-xs text-muted">Billed monthly, cancel anytime</p>
          </div>
          <p className="font-mono font-semibold text-cyan">
            ₹{plan.price.toLocaleString('en-IN')}
          </p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted mb-1.5 block">Cardholder Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name on card"
            className="w-full rounded-lg border border-border bg-panel-secondary px-3 py-2 text-sm outline-none focus:border-cyan/50"
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted mb-1.5 block">Card Number</label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-panel-secondary px-3 py-2">
            <CreditCard className="h-4 w-4 text-muted shrink-0" />
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCard(e.target.value))}
              placeholder="0000 0000 0000 0000"
              className="bg-transparent text-sm outline-none w-full font-mono"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">Expiry</label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              className="w-full rounded-lg border border-border bg-panel-secondary px-3 py-2 text-sm outline-none focus:border-cyan/50 font-mono"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">CVV</label>
            <input
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.slice(0, 4))}
              placeholder="123"
              className="w-full rounded-lg border border-border bg-panel-secondary px-3 py-2 text-sm outline-none focus:border-cyan/50 font-mono"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <Lock className="h-3.5 w-3.5" />
          <span>Mock payment — use test card 4111 1111 1111 1111</span>
        </div>

        {error && <p className="text-sm text-red">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={mutation.isPending}>
            Pay ₹{plan.price.toLocaleString('en-IN')}
          </Button>
        </div>

        <Badge variant="muted" className="w-full justify-center py-1">
          Demo mode — no real charges
        </Badge>
      </form>
    </Modal>
  )
}
