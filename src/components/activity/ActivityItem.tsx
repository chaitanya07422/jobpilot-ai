import {
  Search,
  Cpu,
  Database,
  Sparkles,
  Send,
  CheckCircle,
  Settings,
} from 'lucide-react'
import type { Activity, ActivityType } from '@/types/activity.types'
import { cn } from '@/lib/utils'

const typeConfig: Record<
  ActivityType,
  { icon: typeof Search; color: string; bg: string }
> = {
  discovery: { icon: Search, color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20' },
  embedding: { icon: Cpu, color: 'text-amber', bg: 'bg-amber/10 border-amber/20' },
  search: { icon: Database, color: 'text-green', bg: 'bg-green/10 border-green/20' },
  rerank: { icon: Sparkles, color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20' },
  application: { icon: Send, color: 'text-green', bg: 'bg-green/10 border-green/20' },
  approval: { icon: CheckCircle, color: 'text-amber', bg: 'bg-amber/10 border-amber/20' },
  system: { icon: Settings, color: 'text-muted', bg: 'bg-panel-secondary border-border' },
}

interface ActivityItemProps {
  activity: Activity
  isLast?: boolean
}

export function ActivityItem({ activity, isLast }: ActivityItemProps) {
  const config = typeConfig[activity.type]
  const Icon = config.icon
  const time = new Date(activity.timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg border shrink-0', config.bg)}>
          <Icon className={cn('h-4 w-4', config.color)} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-border mt-2" />}
      </div>
      <div className={cn('pb-6 min-w-0', isLast && 'pb-0')}>
        <p className="font-mono text-xs text-muted">{time}</p>
        <p className="text-sm mt-1">{activity.message}</p>
      </div>
    </div>
  )
}
