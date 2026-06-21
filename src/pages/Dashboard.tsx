import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
import { resumesApi } from '@/api/resumes.api'
import { WelcomeEmptyState } from '@/components/onboarding/WelcomeEmptyState'
import { ResumeJobSuggestions } from '@/components/jobs/ResumeJobSuggestions'
import { StatsBar } from '@/components/dashboard/StatsBar'
import { MatchQueue } from '@/components/dashboard/MatchQueue'
import { MatchScoreRing } from '@/components/dashboard/MatchScoreRing'
import { DiscoveryStatus } from '@/components/dashboard/DiscoveryStatus'
import { RecentMatches } from '@/components/dashboard/RecentMatches'
import { PageLoader } from '@/components/ui/Loader'

export default function Dashboard() {
  const isSubscribed = useAuthStore((s) => s.subscription?.active === true)

  const { data: resumes, isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumesApi.getAll,
  })

  if (isLoading) return <PageLoader />

  const hasResume = (resumes?.length ?? 0) > 0

  if (!hasResume) {
    return <WelcomeEmptyState />
  }

  if (!isSubscribed) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-xl font-semibold">Your Job Matches</h2>
          <p className="text-sm text-muted mt-1">
            Based on your resume — subscribe to unlock full details and auto-apply
          </p>
        </div>
        <ResumeJobSuggestions />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold">AI Operations</h2>
        <p className="text-sm text-muted mt-1">Real-time overview of your job automation pipeline</p>
      </div>

      <StatsBar />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MatchQueue />
        </div>
        <div className="space-y-6">
          <MatchScoreRing />
          <DiscoveryStatus />
        </div>
      </div>

      <RecentMatches />
    </div>
  )
}
