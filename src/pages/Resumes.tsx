import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, ExternalLink, FileText, Trash2, Upload } from 'lucide-react'
import { resumesApi } from '@/api/resumes.api'
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

export default function Resumes() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const queryClient = useQueryClient()
  const isSubscribed = useAuthStore((s) => s.subscription?.active === true)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumesApi.getAll,
  })

  const uploadMutation = useMutation({
    mutationFn: resumesApi.upload,
    onSuccess: (uploaded) => {
      queryClient.setQueryData(['resumes'], [uploaded])
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['job-suggestions'] })
      queryClient.invalidateQueries({ queryKey: ['job-suggestions-summary'] })
      setUploadOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: resumesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['job-suggestions'] })
      queryClient.invalidateQueries({ queryKey: ['job-suggestions-summary'] })
    },
  })

  const resume = data?.[0]
  const hasResume = !!resume

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
        </div>
        {hasResume ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setUploadOpen(true)}>
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
          <Button onClick={() => setUploadOpen(true)}>
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
            description="Upload a PDF resume (max 5MB). We'll store it securely and use it for job matching."
            action={{ label: 'Upload Resume', onClick: () => setUploadOpen(true) }}
          />
          <ResumeUploader
            onUpload={(file) => uploadMutation.mutate(file)}
            loading={uploadMutation.isPending}
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
              <Badge variant="cyan">Active</Badge>
            </div>

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

            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() => resumesApi.openFile(resume)}
            >
              <ExternalLink className="h-4 w-4" /> View PDF
            </Button>
          </Card>

          {uploadMutation.isPending && (
            <Card className="border-cyan/20 bg-cyan/5">
              <p className="text-sm text-center text-muted animate-pulse">
                Uploading resume...
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
        onClose={() => setUploadOpen(false)}
        title={hasResume ? 'Replace Resume' : 'Upload Resume'}
        description="PDF only, max 5MB. Uploading again replaces your current resume."
      >
        <ResumeUploader
          onUpload={(file) => uploadMutation.mutate(file)}
          loading={uploadMutation.isPending}
        />
      </Modal>
    </div>
  )
}
