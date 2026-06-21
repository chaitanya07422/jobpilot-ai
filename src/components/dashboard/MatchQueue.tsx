import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Check, X, ExternalLink } from 'lucide-react'
import { jobsApi } from '@/api/jobs.api'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TableSkeleton } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { getScoreBg } from '@/lib/utils'
import { Inbox } from 'lucide-react'

export function MatchQueue() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['match-queue'],
    queryFn: jobsApi.getMatchQueue,
  })

  const approveMutation = useMutation({
    mutationFn: jobsApi.approve,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['match-queue'] }),
  })

  const rejectMutation = useMutation({
    mutationFn: jobsApi.reject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['match-queue'] }),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Queue</CardTitle>
        <p className="text-sm text-muted mt-1">Jobs awaiting your approval</p>
      </CardHeader>

      {isLoading && <TableSkeleton rows={4} />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && data?.length === 0 && (
        <EmptyState icon={Inbox} title="Queue is empty" description="No jobs pending approval" />
      )}
      {!isLoading && !isError && data && data.length > 0 && (
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="pb-3 font-medium">Company</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Match Score</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((item) => (
                <tr key={item.id} className="group hover:bg-panel-secondary/50 transition-colors">
                  <td className="py-3 font-medium">{item.company}</td>
                  <td className="py-3 text-muted max-w-[200px] truncate">{item.role}</td>
                  <td className="py-3">
                    <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md border ${getScoreBg(item.matchScore)}`}>
                      {item.matchScore}%
                    </span>
                  </td>
                  <td className="py-3">
                    <Badge variant="amber">Pending</Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/jobs/${item.jobId}`)}
                        aria-label="View job"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="green"
                        size="icon"
                        loading={approveMutation.isPending}
                        onClick={() => approveMutation.mutate(item.jobId)}
                        aria-label="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        loading={rejectMutation.isPending}
                        onClick={() => rejectMutation.mutate(item.jobId)}
                        aria-label="Reject"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
