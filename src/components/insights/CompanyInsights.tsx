import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { CompanyInsight } from '@/types/activity.types'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { getScoreBg } from '@/lib/utils'

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
} as const

const trendColor = {
  up: 'text-green',
  down: 'text-red',
  stable: 'text-muted',
} as const

interface CompanyInsightsProps {
  companies: CompanyInsight[]
}

export function CompanyInsights({ companies }: CompanyInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Matching Companies</CardTitle>
        <p className="text-sm text-muted mt-1">Companies with highest average match scores</p>
      </CardHeader>
      <div className="space-y-2">
        {companies.map((company, i) => {
          const Icon = trendIcon[company.trend]
          return (
            <div
              key={company.company}
              className="flex items-center justify-between rounded-lg bg-panel-secondary px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted w-4">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium">{company.company}</p>
                  <p className="text-[10px] text-muted">{company.openRoles} open roles</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Icon className={`h-3.5 w-3.5 ${trendColor[company.trend]}`} />
                <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md border ${getScoreBg(company.matchScore)}`}>
                  {company.matchScore}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
