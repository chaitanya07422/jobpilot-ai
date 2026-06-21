import { MapPin } from 'lucide-react'
import type { Job } from '@/types/job.types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn, getScoreBg } from '@/lib/utils'

interface JobSuggestionCardProps {
  job: Job
  locked?: boolean
  onClick?: () => void
}

export function JobSuggestionCard({ job, locked, onClick }: JobSuggestionCardProps) {
  return (
    <Card
      hover={!locked}
      onClick={locked ? undefined : onClick}
      className={locked ? 'cursor-default' : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={cn('font-heading font-semibold truncate', locked && 'blur-[4px]')}>
            {job.company}
          </p>
          <p className={cn('text-sm text-muted mt-0.5 truncate', locked && 'blur-[4px]')}>
            {job.role}
          </p>
        </div>
        <span
          className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0 ${getScoreBg(job.matchScore)}`}
        >
          {job.matchScore}%
        </span>
      </div>

      <div className={cn('mt-3 flex items-center gap-1.5 text-xs text-muted', locked && 'blur-[4px]')}>
        <MapPin className="h-3 w-3 shrink-0" />
        {job.location}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className={cn('flex items-center gap-2', locked && 'blur-[4px]')}>
          <Badge variant="muted">{job.source}</Badge>
          {job.salary && <Badge variant="green">{job.salary}</Badge>}
        </div>
        {locked && (
          <Badge variant="amber" className="shrink-0">
            Locked
          </Badge>
        )}
      </div>
    </Card>
  )
}
