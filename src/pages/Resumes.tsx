import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Calendar,
  ExternalLink,
  FileText,
  Trash2,
  Upload,
  UserPen,
  AlertCircle,
} from 'lucide-react'
import { resumesApi, setCachedResumeCount } from '@/api/resumes.api'
import { useAuthStore } from '@/store/authStore'
import { ResumeUploader } from '@/components/resumes/ResumeUploader'
import { ResumeJobSuggestions } from '@/components/jobs/ResumeJobSuggestions'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import {
  extractionStatusLabel,
  extractionStatusVariant,
} from '@/lib/resume-profile'

export default function Resumes() {
  const navigate = useNavigate()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const isSubscribed = useAuthStore((s) => s.subscription?.active === true)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumesApi.getAll,
  })

  const { data: quota } = useQuery({
    queryKey: ['resume-quota'],
    queryFn: resumesApi.getQuota,
  })

  const uploadMutation = useMutation({
    mutationFn: resumesApi.upload,
    onSuccess: (uploaded) => {
      setUploadError(null)
      queryClient.setQueryData(['resumes'], [uploaded])
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['resume-profile'] })
      queryClient.invalidateQueries({ queryKey: ['resume-quota'] })
      queryClient.invalidateQueries({ queryKey: ['job-suggestions'] })
      queryClient.invalidateQueries({ queryKey: ['job-suggestions-summary'] })
      setUploadOpen(false)
      if (uploaded.profile || uploaded.extractionStatus) {
        navigate('/resumes/profile')
      }
    },
    onError: (error: Error) => {
      setUploadError(error.message || 'Upload failed')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: resumesApi.delete,
    onSuccess: () => {
      setCachedResumeCount(0)
      queryClient.setQueryData(['resumes'], [])
      queryClient.removeQueries({ queryKey: ['resume-profile'] })
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['resume-profile'] })
      queryClient.invalidateQueries({ queryKey: ['job-suggestions'] })
      queryClient.invalidateQueries({ queryKey: ['job-suggestions-summary'] })
      queryClient.invalidateQueries({ queryKey: ['resume-quota'] })
    },
  })

  const resume = data?.[0]
  const hasResume = !!resume
  const profileStatus = resume?.profile?.extractionStatus ?? resume?.extractionStatus
  const needsReview = profileStatus === 'ready_for_review'
  const extractionFailed = profileStatus === 'failed'
  const canReplace = quota?.canUpload ?? false
  const profileButtonLabel = resume?.profile?.canEditProfile
    ? needsReview
      ? 'Review profile'
      : 'Edit profile'
    : 'View profile'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-semibold">Resume</h2>
          <p className="text-sm text-muted mt-1">
            {hasResume
              ? 'One resume per account — upload a new file to replace it'
              : 'Upload a PDF resume to get started'}
          </p>
          {quota && (
            <p className="text-xs text-muted mt-1">
              {extractionFailed
                ? 'Last upload failed — you can try again'
                : quota.uploadsRemaining == null
                  ? 'Unlimited uploads on your plan'
                  : `${quota.uploadsRemaining} resume upload${quota.uploadsRemaining === 1 ? '' : 's'} left`}
            </p>
          )}
        </div>
        {hasResume ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setUploadOpen(true)}
              disabled={!canReplace}
            >
              <Upload className="h-4 w-4" /> Replace
            </Button>
            <Button
              variant="outline"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(resume.id)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        ) : (
          <Button onClick={() => setUploadOpen(true)} disabled={quota != null && !canReplace}>
            <Upload className="h-4 w-4" /> Upload Resume
          </Button>
        )}
      </div>

      {isLoading && <PageLoader />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && !hasResume && (
        <>
          <EmptyState
            icon={FileText}
            title="No resume uploaded"
            description="Upload a PDF resume (max 5MB). We'll extract your profile and let you review it before matching."
            action={{ label: 'Upload Resume', onClick: () => setUploadOpen(true) }}
          />
          <ResumeUploader
            onUpload={(file) => uploadMutation.mutate(file)}
            loading={uploadMutation.isPending}
            loadingLabel="Uploading and extracting profile..."
          />
        </>
      )}
      {!isLoading && !isError && hasResume && (
        <>
          <Card className="border-cyan/30 shadow-lg shadow-cyan/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-panel-secondary border border-border">
                  <FileText className="h-5 w-5 text-cyan" />
                </div>
                <div>
                  <p className="font-heading font-semibold">{resume.name}</p>
                  <p className="text-xs text-muted mt-0.5">{resume.fileName}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="cyan">Active</Badge>
                {profileStatus && (
                  <Badge variant={extractionStatusVariant(profileStatus)}>
                    {extractionStatusLabel(profileStatus)}
                  </Badge>
                )}
              </div>
            </div>

            {extractionFailed && resume.extractionError && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-red/20 bg-red/5 px-3 py-2">
                <AlertCircle className="h-4 w-4 text-red shrink-0 mt-0.5" />
                <p className="text-xs text-muted">{resume.extractionError}</p>
              </div>
            )}

            {!profileStatus && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber/20 bg-amber/5 px-3 py-2">
                <AlertCircle className="h-4 w-4 text-amber shrink-0 mt-0.5" />
                <p className="text-xs text-muted">
                  Profile not extracted yet. Replace the resume to run extraction again.
                </p>
              </div>
            )}

            {resume.skillsExtracted.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted mb-2">Skills Extracted</p>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skillsExtracted.map((skill) => (
                    <Badge key={skill} variant="muted">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-xs text-muted">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(resume.uploadDate)}
              </div>
              <span>{resume.fileSize}</span>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => resumesApi.openFile(resume)}
              >
                <ExternalLink className="h-4 w-4" /> View PDF
              </Button>
              <Button
                size="sm"
                variant={needsReview ? 'default' : 'outline'}
                onClick={() => navigate('/resumes/profile')}
              >
                <UserPen className="h-4 w-4" />
                {profileButtonLabel}
              </Button>
            </div>
          </Card>

          {uploadMutation.isPending && (
            <Card className="border-cyan/20 bg-cyan/5">
              <p className="text-sm text-center text-muted animate-pulse">
                Uploading and extracting profile — this may take up to a minute...
              </p>
            </Card>
          )}

          <ResumeJobSuggestions />

          {!isSubscribed && (
            <p className="text-xs text-center text-muted">
              Match scores are visible — subscribe to unlock company details and enable auto-apply
            </p>
          )}
        </>
      )}

      <Modal
        open={uploadOpen}
        onClose={() => !uploadMutation.isPending && setUploadOpen(false)}
        title={hasResume ? 'Replace Resume' : 'Upload Resume'}
        description={
          !canReplace
            ? "You've used all your resume uploads. Upgrade your plan to upload more."
            : extractionFailed
              ? 'PDF only, max 5MB. Your last upload failed — try again at no extra cost.'
              : 'PDF only, max 5MB. Uploading a new file replaces your current resume.'
        }
      >
        {quota && quota.uploadsRemaining != null && quota.uploadsRemaining > 0 && !extractionFailed && (
          <p className="mb-3 text-xs text-muted text-center">
            {quota.uploadsRemaining} upload{quota.uploadsRemaining === 1 ? '' : 's'} remaining.
          </p>
        )}
        <ResumeUploader
          onUpload={(file) => {
            setUploadError(null)
            uploadMutation.mutate(file)
          }}
          loading={uploadMutation.isPending}
          loadingLabel="Uploading and extracting profile..."
          disabled={!canReplace}
        />
        {uploadError && (
          <p className="mt-3 text-sm text-red text-center">{uploadError}</p>
        )}
      </Modal>
    </div>
  )
}
