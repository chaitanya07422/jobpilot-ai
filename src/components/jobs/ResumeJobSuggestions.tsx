import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Sparkles, Briefcase } from 'lucide-react'
import { suggestionsApi } from '@/api/suggestions.api'
import { useAuthStore } from '@/store/authStore'
import { JobSuggestionCard } from '@/components/jobs/JobSuggestionCard'
import { SubscribeBanner } from '@/components/ui/BlurredOverlay'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CardSkeleton } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/EmptyState'

interface ResumeJobSuggestionsProps {
  compact?: boolean
}

export function ResumeJobSuggestions({ compact }: ResumeJobSuggestionsProps) {
  const navigate = useNavigate()
  const isSubscribed = useAuthStore((s) => s.subscription?.active === true)

  const { data: jobs, isLoading, isError, refetch } = useQuery({
    queryKey: ['job-suggestions'],
    queryFn: suggestionsApi.getForResume,
  })

  const { data: summary } = useQuery({
    queryKey: ['job-suggestions-summary'],
    queryFn: suggestionsApi.getSummary,
  })

  if (isLoading) return <CardSkeleton />
  if (isError) return <ErrorState onRetry={() => refetch()} />
  if (!jobs || jobs.length === 0) return null

  const locked = !isSubscribed

  return (
    <div className="space-y-4">
      {!compact && summary && (
        <SubscribeBanner
          matchCount={summary.totalMatches}
          topScore={summary.topMatchScore}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan" />
                Jobs matched to your resume
              </CardTitle>
              <p className="text-sm text-muted mt-1">
                AI analyzed your skills and found {jobs.length} backend roles you can apply to
              </p>
            </div>
            {locked && <Badge variant="amber">Preview</Badge>}
          </div>
        </CardHeader>

        <div className="relative">
          <div className={locked ? 'grid sm:grid-cols-2 gap-3' : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-3'}>
            {jobs.map((job) => (
              <JobSuggestionCard
                key={job.id}
                job={job}
                locked={locked}
                onClick={() => !locked && navigate(`/jobs/${job.id}`)}
              />
            ))}
          </div>

          {locked && (
            <div className="mt-4 rounded-xl border border-amber/20 bg-amber/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <Briefcase className="h-5 w-5 text-amber shrink-0" />
                <p className="text-sm text-muted">
                  Job details are blurred. Subscribe to unlock company names, apply links, and{' '}
                  <span className="text-foreground font-medium">auto-apply</span>.
                </p>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="text-sm font-medium text-cyan hover:underline shrink-0"
              >
                Unlock all {jobs.length} matches →
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
