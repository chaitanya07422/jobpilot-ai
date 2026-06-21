import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-panel-secondary text-foreground border-border',
  cyan: 'bg-cyan/10 text-cyan border-cyan/20',
  green: 'bg-green/10 text-green border-green/20',
  amber: 'bg-amber/10 text-amber border-amber/20',
  red: 'bg-red/10 text-red border-red/20',
  muted: 'bg-panel text-muted border-border',
} as const

interface BadgeProps {
  children: React.ReactNode
  variant?: keyof typeof variants
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
