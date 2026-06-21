import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '@/api/jobs.api'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'
import type { DiscoverySource } from '@/types/job.types'

const statusConfig = {
  healthy: { color: 'bg-green', label: 'Healthy' },
  degraded: { color: 'bg-amber', label: 'Degraded' },
  offline: { color: 'bg-red', label: 'Offline' },
} as const

function SourceItem({ source }: { source: DiscoverySource }) {
  const config = statusConfig[source.status]
  const lastSync = source.lastSync
    ? new Date(source.lastSync).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : 'Never'

  return (
    <div className="flex items-center justify-between rounded-lg bg-panel-secondary px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <div className={cn('h-2 w-2 rounded-full shrink-0', config.color, source.status === 'healthy' && 'animate-pulse-ring')} />
        <div>
          <p className="text-sm font-medium">{source.name}</p>
          <p className="text-[10px] text-muted">Last sync {lastSync}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm font-semibold">{source.jobsFound}</p>
        <p className="text-[10px] text-muted">{config.label}</p>
      </div>
    </div>
  )
}

export function DiscoveryStatus() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['discovery-sources'],
    queryFn: jobsApi.getDiscoverySources,
  })

  if (isLoading) return <CardSkeleton />
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discovery Status</CardTitle>
        <p className="text-sm text-muted mt-1">Job source health indicators</p>
      </CardHeader>
      <div className="space-y-2">
        {data.map((source) => (
          <SourceItem key={source.name} source={source} />
        ))}
      </div>
    </Card>
  )
}
