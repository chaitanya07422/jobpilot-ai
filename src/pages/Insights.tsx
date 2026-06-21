import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BarChart3 } from 'lucide-react'
import { insightsApi } from '@/api/insights.api'
import { useAuthStore } from '@/store/authStore'
import { SkillGapCard, PotentialMatchIncrease } from '@/components/insights/SkillGapCard'
import { CompanyInsights } from '@/components/insights/CompanyInsights'
import { MatchTrendChart } from '@/components/insights/MatchTrendChart'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'

export default function Insights() {
  const navigate = useNavigate()
  const isSubscribed = useAuthStore((s) => s.subscription?.active === true)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['insights'],
    queryFn: insightsApi.getAll,
  })

  if (isLoading) return <PageLoader />
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />

  if (!isSubscribed || data.missingSkills.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-xl font-semibold">AI Insights</h2>
          <p className="text-sm text-muted mt-1">
            Data-driven recommendations to improve your match rate
          </p>
        </div>
        <EmptyState
          icon={BarChart3}
          title={isSubscribed ? 'No insights yet' : 'Insights locked'}
          description={
            isSubscribed
              ? 'Run your first job scan to generate AI-powered insights'
              : 'Subscribe to unlock skill gap analysis, company insights, and match trends'
          }
          action={
            isSubscribed
              ? undefined
              : { label: 'View Plans', onClick: () => navigate('/pricing') }
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold">AI Insights</h2>
        <p className="text-sm text-muted mt-1">
          Data-driven recommendations to improve your match rate
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SkillGapCard skills={data.missingSkills} totalIncrease={data.totalPotentialIncrease} />
        <PotentialMatchIncrease value={data.totalPotentialIncrease} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <CompanyInsights companies={data.topCompanies} />
        <MatchTrendChart data={data.weeklyTrend} />
      </div>
    </div>
  )
}
