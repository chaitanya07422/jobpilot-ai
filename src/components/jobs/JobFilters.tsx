import { Search } from 'lucide-react'
import type { JobSource, JobStatus } from '@/types/job.types'

export interface JobFilterState {
  search: string
  status: JobStatus | 'all'
  minScore: number
  source: JobSource | 'all'
}

interface JobFiltersProps {
  filters: JobFilterState
  onChange: (filters: JobFilterState) => void
}

const statuses: Array<{ value: JobStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All Statuses' },
  { value: 'discovered', label: 'Discovered' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'approved', label: 'Approved' },
  { value: 'applied', label: 'Applied' },
  { value: 'rejected', label: 'Rejected' },
]

const sources: Array<{ value: JobSource | 'all'; label: string }> = [
  { value: 'all', label: 'All Sources' },
  { value: 'Greenhouse', label: 'Greenhouse' },
  { value: 'Lever', label: 'Lever' },
  { value: 'Ashby', label: 'Ashby' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Naukri', label: 'Naukri' },
]

export function JobFilters({ filters, onChange }: JobFiltersProps) {
  const update = (partial: Partial<JobFilterState>) =>
    onChange({ ...filters, ...partial })

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 flex-1 min-w-[200px]">
        <Search className="h-4 w-4 text-muted shrink-0" />
        <input
          type="text"
          placeholder="Search company, role, location..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="bg-transparent text-sm outline-none placeholder:text-muted w-full"
        />
      </div>

      <select
        value={filters.status}
        onChange={(e) => update({ status: e.target.value as JobStatus | 'all' })}
        className="rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-cyan/50"
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        value={filters.minScore}
        onChange={(e) => update({ minScore: Number(e.target.value) })}
        className="rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-cyan/50"
      >
        <option value={0}>Any Match Score</option>
        <option value={70}>70%+</option>
        <option value={80}>80%+</option>
        <option value={90}>90%+</option>
      </select>

      <select
        value={filters.source}
        onChange={(e) => update({ source: e.target.value as JobSource | 'all' })}
        className="rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-cyan/50"
      >
        {sources.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  )
}
