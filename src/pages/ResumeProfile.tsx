import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, ArrowLeft, CheckCircle2, Info } from 'lucide-react'
import { resumesApi } from '@/api/resumes.api'
import { ResumeProfileEditor } from '@/components/resumes/ResumeProfileEditor'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  extractionStatusLabel,
  extractionStatusVariant,
} from '@/lib/resume-profile'
import type { UpdateResumeProfilePayload } from '@/types/resume.types'

export default function ResumeProfile() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['resume-profile'],
    queryFn: resumesApi.getProfile,
  })

  const {
    data: quota,
  } = useQuery({
    queryKey: ['resume-quota'],
    queryFn: resumesApi.getQuota,
  })

  const saveMutation = useMutation({
    mutationFn: resumesApi.updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(['resume-profile'], updated)
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      navigate('/resumes')
    },
    onError: (error: Error) => {
      window.alert(error.message || 'Could not save profile')
    },
  })

  const confirmMutation = useMutation({
    mutationFn: (payload: UpdateResumeProfilePayload) =>
      resumesApi.confirmProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['resume-profile'], updated)
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['job-suggestions'] })
      navigate('/resumes')
    },
    onError: (error: Error) => {
      window.alert(error.message || 'Could not confirm profile')
    },
  })

  const handleSave = (payload: UpdateResumeProfilePayload) => {
    saveMutation.mutate(payload)
  }

  const handleConfirm = (payload: UpdateResumeProfilePayload) => {
    confirmMutation.mutate(payload)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => navigate('/resumes')}>
            <ArrowLeft className="h-4 w-4" /> Back to resume
          </Button>
          <h2 className="font-heading text-xl font-semibold">Resume profile</h2>
          <p className="text-sm text-muted mt-1">
            Review and edit what we extracted from your PDF before matching jobs
          </p>
        </div>
        {profile && (
          <Badge variant={extractionStatusVariant(profile.extractionStatus)}>
            {extractionStatusLabel(profile.extractionStatus)}
          </Badge>
        )}
      </div>

      {profile && profile.canEditProfile && profile.extractionStatus === 'confirmed' && (
        <Card className="border-cyan/30 bg-cyan/5">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-cyan shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Profile confirmed — edits still available</p>
              <p className="text-xs text-muted">
                You can save changes{' '}
                <strong>
                  {profile.editsRemaining} more time{profile.editsRemaining === 1 ? '' : 's'}
                </strong>
                . Each save updates your matching profile in Qdrant.
              </p>
            </div>
          </div>
        </Card>
      )}

      {profile && profile.canEditProfile && profile.extractionStatus !== 'confirmed' && (
        <Card className="border-cyan/30 bg-cyan/5">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-cyan shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Review your profile</p>
              <p className="text-xs text-muted">
                You can save changes{' '}
                <strong>
                  {profile.editsRemaining} more time{profile.editsRemaining === 1 ? '' : 's'}
                </strong>
                . After you confirm, your profile is locked
                {quota?.uploadsRemaining != null
                  ? ` — upload a new resume to change it (${quota.uploadsRemaining} upload${quota.uploadsRemaining === 1 ? '' : 's'} left).`
                  : '.'}
              </p>
              {!profile.canSaveProfile && (
                <p className="text-xs text-amber">
                  No saves left. Confirm now, or upload a new resume to start over.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {profile?.isReadOnly && profile.extractionStatus === 'confirmed' && (
        <Card className="border-green/30 bg-green/5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Profile confirmed</p>
              <p className="text-xs text-muted mt-1">
                {profile.qdrantSyncedAt
                  ? "You're ready for job matching."
                  : profile.qdrantSyncError
                    ? "We couldn't finish setup. Try confirming again."
                    : 'Your profile is confirmed.'}{' '}
                To make changes, upload a new resume
                {quota?.uploadsRemaining != null
                  ? ` (${quota.uploadsRemaining} upload${quota.uploadsRemaining === 1 ? '' : 's'} left).`
                  : '.'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {profile?.extractionStatus === 'failed' && profile.extractionError && (
        <Card className="border-red/30 bg-red/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Extraction failed</p>
              <p className="text-xs text-muted mt-1">{profile.extractionError}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate('/resumes')}
              >
                Re-upload resume
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isLoading && <PageLoader />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {!isLoading && !isError && profile && (
        <ResumeProfileEditor
          profile={profile}
          saving={saveMutation.isPending}
          confirming={confirmMutation.isPending}
          onSave={handleSave}
          onConfirm={handleConfirm}
          onBack={() => navigate('/resumes')}
        />
      )}
    </div>
  )
}
