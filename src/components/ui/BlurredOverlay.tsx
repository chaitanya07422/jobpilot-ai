import { useNavigate } from 'react-router-dom'
import { Lock, Sparkles, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface BlurredOverlayProps {
  title?: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
  className?: string
}

export function BlurredOverlay({
  title = 'Subscribe to unlock',
  description = 'Get full job details, match analysis, and auto-apply',
  ctaLabel = 'View Plans',
  onCta,
  className,
}: BlurredOverlayProps) {
  const navigate = useNavigate()

  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl',
        'bg-background/60 backdrop-blur-[2px]',
        className,
      )}
    >
      <div className="text-center px-6 py-8 max-w-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/20">
          <Lock className="h-5 w-5 text-cyan" />
        </div>
        <h3 className="font-heading text-base font-semibold">{title}</h3>
        <p className="text-sm text-muted mt-2">{description}</p>
        <Button className="mt-5" onClick={onCta ?? (() => navigate('/pricing'))}>
          <Sparkles className="h-4 w-4" /> {ctaLabel}
        </Button>
      </div>
    </div>
  )
}

interface PremiumGateProps {
  locked: boolean
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export function PremiumGate({ locked, children, title, description, className }: PremiumGateProps) {
  if (!locked) return <>{children}</>

  return (
    <div className={cn('relative overflow-hidden rounded-xl', className)}>
      <div className="select-none pointer-events-none blur-[6px] opacity-70">{children}</div>
      <BlurredOverlay title={title} description={description} />
    </div>
  )
}

interface SubscribeBannerProps {
  matchCount: number
  topScore: number
  className?: string
}

export function SubscribeBanner({ matchCount, topScore, className }: SubscribeBannerProps) {
  const navigate = useNavigate()

  return (
    <div
      className={cn(
        'rounded-xl border border-cyan/20 bg-gradient-to-r from-cyan/10 via-panel to-panel p-4 sm:p-5',
        'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/20 shrink-0">
          <Zap className="h-5 w-5 text-cyan" />
        </div>
        <div>
          <p className="font-heading font-semibold">
            {matchCount} jobs match your resume
          </p>
          <p className="text-sm text-muted mt-0.5">
            Top match {topScore}% — subscribe to unlock details & enable auto-apply
          </p>
        </div>
      </div>
      <Button onClick={() => navigate('/pricing')} className="shrink-0 w-full sm:w-auto">
        Unlock & Auto-Apply
      </Button>
    </div>
  )
}
