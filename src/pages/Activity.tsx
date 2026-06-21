import { useQuery } from '@tanstack/react-query'
import { Activity as ActivityIcon } from 'lucide-react'
import { activityApi } from '@/api/insights.api'
import { ActivityTimeline } from '@/components/activity/ActivityTimeline'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'

export default function Activity() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['activities'],
    queryFn: activityApi.getAll,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold">Activity Log</h2>
        <p className="text-sm text-muted mt-1">Real-time pipeline events and automation actions</p>
      </div>

      {isLoading && <PageLoader />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && data?.length === 0 && (
        <EmptyState
          icon={ActivityIcon}
          title="No activity yet"
          description="Pipeline events will appear here as automation runs"
        />
      )}
      {!isLoading && !isError && data && data.length > 0 && (
        <ActivityTimeline activities={data} />
      )}
    </div>
  )
}
