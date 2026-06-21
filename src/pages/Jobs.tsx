import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Briefcase, FileText } from 'lucide-react'
import { jobsApi } from '@/api/jobs.api'
import { resumesApi } from '@/api/resumes.api'
import { useAuthStore } from '@/store/authStore'
import { JobFilters, type JobFilterState } from '@/components/jobs/JobFilters'
import { JobTable } from '@/components/jobs/JobTable'
import { JobCard } from '@/components/jobs/JobCard'
import { ResumeJobSuggestions } from '@/components/jobs/ResumeJobSuggestions'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'

export default function Jobs() {
  const navigate = useNavigate()
  const isSubscribed = useAuthStore((s) => s.subscription?.active === true)
  const [filters, setFilters] = useState<JobFilterState>({
    search: '',
    status: 'all',
    minScore: 0,
    source: 'all',
  })

  const { data: resumes, isLoading: resumesLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumesApi.getAll,
  })

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () =>
      jobsApi.getAll({
        search: filters.search || undefined,
        status: filters.status,
        minScore: filters.minScore || undefined,
        source: filters.source,
      }),
    enabled: isSubscribed,
  })

  if (resumesLoading) return <PageLoader />

  const hasResume = (resumes?.length ?? 0) > 0

  if (!hasResume) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-xl font-semibold">Discovered Jobs</h2>
          <p className="text-sm text-muted mt-1">Upload your resume to see personalized matches</p>
        </div>
        <EmptyState
          icon={FileText}
          title="Upload resume first"
          description="We'll analyze your skills and suggest jobs you can apply to"
          action={{ label: 'Upload Resume', onClick: () => navigate('/resumes') }}
        />
      </div>
    )
  }

  if (!isSubscribed) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-xl font-semibold">Jobs for You</h2>
          <p className="text-sm text-muted mt-1">
            Matched to your resume — subscribe to unlock full listings & auto-apply
          </p>
        </div>
        <ResumeJobSuggestions />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold">Discovered Jobs</h2>
        <p className="text-sm text-muted mt-1">
          {data ? `${data.length} jobs found` : 'Loading jobs...'}
        </p>
      </div>

      <JobFilters filters={filters} onChange={setFilters} />

      {isLoading && <PageLoader />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && data?.length === 0 && (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Try adjusting your filters or wait for the next discovery scan"
        />
      )}
      {!isLoading && !isError && data && data.length > 0 && (
        <>
          <div className="hidden md:block">
            <JobTable jobs={data} />
          </div>
          <div className="md:hidden grid gap-4">
            {data.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
