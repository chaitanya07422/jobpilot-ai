import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { jobsApi } from '@/api/jobs.api'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CardSkeleton } from '@/components/ui/Loader'
import { getScoreBg } from '@/lib/utils'

export function RecentMatches() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.getAll({ minScore: 85 }),
  })

  if (isLoading) return <CardSkeleton />

  const recent = data?.slice(0, 5) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent High Matches</CardTitle>
        <p className="text-sm text-muted mt-1">Jobs with 85%+ match score</p>
      </CardHeader>
      <div className="space-y-2">
        {recent.map((job) => (
          <button
            key={job.id}
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="flex w-full items-center justify-between rounded-lg bg-panel-secondary px-3 py-2.5 text-left transition-colors hover:bg-panel-secondary/80 hover:border-cyan/20 border border-transparent"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{job.company}</p>
              <p className="text-xs text-muted truncate">{job.role}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md border ${getScoreBg(job.matchScore)}`}>
                {job.matchScore}%
              </span>
              <Badge variant={job.status === 'pending_approval' ? 'amber' : 'muted'}>
                {job.status.replace('_', ' ')}
              </Badge>
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}
