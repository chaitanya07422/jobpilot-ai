import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import type { MatchBreakdown } from '@/types/job.types'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatPercent } from '@/lib/utils'

interface MatchBreakdownProps {
  breakdown: MatchBreakdown
  overallScore: number
}

export function MatchBreakdownView({ breakdown, overallScore }: MatchBreakdownProps) {
  const chartData = [
    { metric: 'Skills', value: breakdown.skillsMatch, fullMark: 100 },
    { metric: 'Experience', value: breakdown.experienceMatch, fullMark: 100 },
    { metric: 'Embedding', value: breakdown.embeddingSimilarity, fullMark: 100 },
    { metric: 'Gemini', value: breakdown.geminiScore, fullMark: 100 },
  ]

  const items = [
    { label: 'Skills Match', value: breakdown.skillsMatch },
    { label: 'Experience Match', value: breakdown.experienceMatch },
    { label: 'Embedding Similarity', value: breakdown.embeddingSimilarity },
    { label: 'Gemini Score', value: breakdown.geminiScore },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Analysis</CardTitle>
        <p className="text-sm text-muted mt-1">
          Overall match score: <span className="font-mono text-cyan font-semibold">{overallScore}%</span>
        </p>
      </CardHeader>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted">{item.label}</span>
                <span className="font-mono font-medium">{formatPercent(item.value)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-panel-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan transition-all duration-700"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="#2A3344" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#8A93A6', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#8A93A6', fontSize: 10 }} />
              <Radar
                name="Match"
                dataKey="value"
                stroke="#4ECDC4"
                fill="#4ECDC4"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
