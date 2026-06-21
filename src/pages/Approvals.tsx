import { useQuery } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { jobsApi } from '@/api/jobs.api'
import { MatchQueue } from '@/components/dashboard/MatchQueue'
import { JobCard } from '@/components/jobs/JobCard'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'

export default function Approvals() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['jobs', { status: 'pending_approval' }],
    queryFn: () => jobsApi.getAll({ status: 'pending_approval' }),
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold">Pending Approvals</h2>
        <p className="text-sm text-muted mt-1">
          Review and approve high-match jobs before auto-apply
        </p>
      </div>

      <MatchQueue />

      {isLoading && <PageLoader />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && data?.length === 0 && (
        <EmptyState
          icon={CheckCircle2}
          title="All caught up"
          description="No jobs waiting for your approval"
          action={{ label: 'Browse Jobs', onClick: () => navigate('/jobs') }}
        />
      )}
      {!isLoading && !isError && data && data.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
