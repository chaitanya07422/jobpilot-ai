import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, MapPin, ExternalLink, Check, X, Lock } from 'lucide-react'
import { jobsApi } from '@/api/jobs.api'
import { useAuthStore } from '@/store/authStore'
import { MatchBreakdownView } from '@/components/jobs/MatchBreakdown'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/EmptyState'

export default function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isSubscribed = useAuthStore((s) => s.subscription?.active === true)

  const { data: job, isLoading, isError, refetch } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getById(id!),
    enabled: !!id && isSubscribed,
  })

  const approveMutation = useMutation({
    mutationFn: () => jobsApi.approve(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] })
      queryClient.invalidateQueries({ queryKey: ['match-queue'] })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: () => jobsApi.reject(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] })
      queryClient.invalidateQueries({ queryKey: ['match-queue'] })
    },
  })

  if (!isSubscribed) {
    return (
      <div className="space-y-6 max-w-lg mx-auto text-center py-12">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-amber/10 border border-amber/20">
          <Lock className="h-7 w-7 text-amber" />
        </div>
        <h2 className="font-heading text-xl font-semibold">Job details locked</h2>
        <p className="text-sm text-muted">
          Subscribe to view full job descriptions, apply links, and enable auto-apply.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate('/jobs')}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button onClick={() => navigate('/pricing')}>View Plans</Button>
        </div>
      </div>
    )
  }

  if (isLoading) return <PageLoader />
  if (isError || !job) return <ErrorState onRetry={() => refetch()} />

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </button>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold">{job.company}</h2>
            <p className="text-lg text-muted mt-1">{job.role}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="muted">{job.source}</Badge>
              {job.salary && <Badge variant="green">{job.salary}</Badge>}
              <span className="flex items-center gap-1 text-xs text-muted">
                <MapPin className="h-3 w-3" /> {job.location}
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="green"
              loading={approveMutation.isPending}
              onClick={() => approveMutation.mutate()}
            >
              <Check className="h-4 w-4" /> Approve Application
            </Button>
            <Button
              variant="destructive"
              loading={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate()}
            >
              <X className="h-4 w-4" /> Reject
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <p className="text-sm text-muted leading-relaxed">{job.description}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map((skill) => (
              <Badge key={skill} variant="cyan">{skill}</Badge>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-cyan hover:underline"
          >
            <ExternalLink className="h-4 w-4" /> View Application URL
          </a>
        </div>
      </Card>

      <MatchBreakdownView breakdown={job.matchBreakdown} overallScore={job.matchScore} />
    </div>
  )
}
