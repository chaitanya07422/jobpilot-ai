import { useQuery } from '@tanstack/react-query'
import { Scan, Clock, Send, TrendingUp } from 'lucide-react'
import { jobsApi } from '@/api/jobs.api'
import { Card } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

const statConfig = [
  { key: 'jobsScannedToday' as const, label: 'Jobs Scanned Today', icon: Scan, color: 'text-cyan', suffix: '' },
  { key: 'pendingApproval' as const, label: 'Pending Approval', icon: Clock, color: 'text-amber', suffix: '' },
  { key: 'appliedThisWeek' as const, label: 'Applied This Week', icon: Send, color: 'text-green', suffix: '' },
  { key: 'interviewRate' as const, label: 'Interview Rate', icon: TrendingUp, color: 'text-cyan', suffix: '%' },
]

export function StatsBar() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: jobsApi.getDashboardStats,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError || !data) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map(({ key, label, icon: Icon, color, suffix }, i) => (
        <Card
          key={key}
          className={cn('animate-fade-in opacity-0', `delay-[${i * 100}ms]`)}
          style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted font-medium">{label}</p>
              <p className={cn('font-mono text-3xl font-semibold mt-2', color)}>
                {data[key]}
                {suffix}
              </p>
            </div>
            <div className={cn('rounded-lg p-2 bg-panel-secondary border border-border', color)}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
