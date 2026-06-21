import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const variants = {
  default: 'bg-cyan text-background hover:bg-cyan/90',
  secondary: 'bg-panel-secondary text-foreground hover:bg-panel-secondary/80 border border-border',
  outline: 'border border-border bg-transparent hover:bg-panel-secondary text-foreground',
  ghost: 'hover:bg-panel-secondary text-muted hover:text-foreground',
  destructive: 'bg-red/10 text-red border border-red/20 hover:bg-red/20',
  amber: 'bg-amber/10 text-amber border border-amber/20 hover:bg-amber/20',
  green: 'bg-green/10 text-green border border-green/20 hover:bg-green/20',
} as const

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-6 text-sm',
  icon: 'h-9 w-9',
} as const

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
