import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '@/api/jobs.api'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/EmptyState'
import { cn, formatPercent } from '@/lib/utils'
import type { MatchBreakdown } from '@/types/job.types'

interface ScoreItemProps {
  label: string
  value: number
}

function ScoreItem({ label, value }: ScoreItemProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-mono font-medium text-foreground">{formatPercent(value)}</span>
    </div>
  )
}

function MatchRing({ score, breakdown }: { score: number; breakdown: MatchBreakdown }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#2A3344" strokeWidth="8" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#4ECDC4"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-bold text-cyan">{score}%</span>
          <span className="text-[10px] text-muted mt-0.5">Match Score</span>
        </div>
      </div>

      <div className="mt-5 w-full space-y-2.5">
        <ScoreItem label="Skills Match" value={breakdown.skillsMatch} />
        <ScoreItem label="Experience Match" value={breakdown.experienceMatch} />
        <ScoreItem label="Embedding Similarity" value={breakdown.embeddingSimilarity} />
        <ScoreItem label="Gemini Re-rank Score" value={breakdown.geminiScore} />
      </div>
    </div>
  )
}

export function MatchScoreRing() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['featured-match'],
    queryFn: jobsApi.getFeaturedMatch,
  })

  if (isLoading) return <CardSkeleton />
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Match</CardTitle>
        <p className="text-sm text-muted mt-1">
          {data.company} — {data.role}
        </p>
      </CardHeader>
      <MatchRing score={data.matchScore} breakdown={data.matchBreakdown} />
    </Card>
  )
}

export function MatchScoreRingCompact({ score, breakdown }: { score: number; breakdown: MatchBreakdown }) {
  return (
    <div className={cn('rounded-xl border border-border bg-panel p-5')}>
      <MatchRing score={score} breakdown={breakdown} />
    </div>
  )
}
