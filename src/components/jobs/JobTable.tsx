import { useNavigate } from 'react-router-dom'
import type { Job } from '@/types/job.types'
import { Badge } from '@/components/ui/Badge'
import { getScoreBg } from '@/lib/utils'

const statusVariant: Record<Job['status'], 'cyan' | 'amber' | 'green' | 'red' | 'muted'> = {
  discovered: 'muted',
  pending_approval: 'amber',
  approved: 'cyan',
  applied: 'green',
  rejected: 'red',
}

interface JobTableProps {
  jobs: Job[]
}

export function JobTable({ jobs }: JobTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-panel-secondary text-left text-xs text-muted">
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Location</th>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">Source</th>
            <th className="px-4 py-3 font-medium">Match Score</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-panel">
          {jobs.map((job) => (
            <tr
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="cursor-pointer transition-colors hover:bg-panel-secondary/50"
            >
              <td className="px-4 py-3 font-medium">{job.company}</td>
              <td className="px-4 py-3 text-muted max-w-[200px] truncate">{job.role}</td>
              <td className="px-4 py-3 text-muted hidden md:table-cell">{job.location}</td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <Badge variant="muted">{job.source}</Badge>
              </td>
              <td className="px-4 py-3">
                <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md border ${getScoreBg(job.matchScore)}`}>
                  {job.matchScore}%
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[job.status]}>
                  {job.status.replace('_', ' ')}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
