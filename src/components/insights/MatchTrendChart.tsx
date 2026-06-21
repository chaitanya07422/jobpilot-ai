import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { WeeklyMatchTrend } from '@/types/activity.types'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

interface MatchTrendChartProps {
  data: WeeklyMatchTrend[]
}

export function MatchTrendChart({ data }: MatchTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Match Trend</CardTitle>
        <p className="text-sm text-muted mt-1">Matches discovered vs applications submitted</p>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9F1C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF9F1C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A3344" />
            <XAxis dataKey="week" tick={{ fill: '#8A93A6', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8A93A6', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#141925',
                border: '1px solid #2A3344',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#8A93A6' }} />
            <Area
              type="monotone"
              dataKey="matches"
              stroke="#4ECDC4"
              fill="url(#matchGrad)"
              strokeWidth={2}
              name="Matches"
            />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="#FF9F1C"
              fill="url(#appGrad)"
              strokeWidth={2}
              name="Applications"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
