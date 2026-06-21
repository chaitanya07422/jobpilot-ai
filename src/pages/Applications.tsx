import { useQuery } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import { applicationsApi } from '@/api/applications.api'
import { ApplicationPipeline } from '@/components/applications/ApplicationPipeline'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'

export default function Applications() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationsApi.getAll,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold">Application Pipeline</h2>
        <p className="text-sm text-muted mt-1">
          Drag cards between columns to update application status
        </p>
      </div>

      {isLoading && <PageLoader />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && data?.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Approved jobs will appear here as applications"
        />
      )}
      {!isLoading && !isError && data && data.length > 0 && (
        <ApplicationPipeline applications={data} />
      )}
    </div>
  )
}
