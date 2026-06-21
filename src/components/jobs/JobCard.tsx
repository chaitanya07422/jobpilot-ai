import { useNavigate } from 'react-router-dom'
import { MapPin, ExternalLink } from 'lucide-react'
import type { Job } from '@/types/job.types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getScoreBg } from '@/lib/utils'

const statusVariant: Record<Job['status'], 'cyan' | 'amber' | 'green' | 'red' | 'muted'> = {
  discovered: 'muted',
  pending_approval: 'amber',
  approved: 'cyan',
  applied: 'green',
  rejected: 'red',
}

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate()

  return (
    <Card hover onClick={() => navigate(`/jobs/${job.id}`)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-heading font-semibold">{job.company}</p>
          <p className="text-sm text-muted mt-0.5 truncate">{job.role}</p>
        </div>
        <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0 ${getScoreBg(job.matchScore)}`}>
          {job.matchScore}%
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
        <MapPin className="h-3 w-3" />
        {job.location}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="muted">{job.source}</Badge>
          <Badge variant={statusVariant[job.status]}>
            {job.status.replace('_', ' ')}
          </Badge>
        </div>
        <ExternalLink className="h-4 w-4 text-muted" />
      </div>
    </Card>
  )
}
