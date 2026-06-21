import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import { resumesApi } from '@/api/resumes.api'
import { useAuthStore } from '@/store/authStore'
import { ResumeCard } from '@/components/resumes/ResumeCard'
import { ResumeUploader } from '@/components/resumes/ResumeUploader'
import { ResumeJobSuggestions } from '@/components/jobs/ResumeJobSuggestions'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Upload } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function Resumes() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const queryClient = useQueryClient()
  const isSubscribed = useAuthStore((s) => s.subscription?.active === true)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumesApi.getAll,
  })

  const setPrimaryMutation = useMutation({
    mutationFn: resumesApi.setPrimary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  })

  const uploadMutation = useMutation({
    mutationFn: resumesApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['job-suggestions'] })
      queryClient.invalidateQueries({ queryKey: ['job-suggestions-summary'] })
      setUploadOpen(false)
    },
  })

  const hasResume = (data?.length ?? 0) > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold">Resumes</h2>
          <p className="text-sm text-muted mt-1">
            {hasResume
              ? 'Your resume has been analyzed — see matched jobs below'
              : 'Upload a resume to get personalized job suggestions'}
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" /> Upload Resume
        </Button>
      </div>

      {isLoading && <PageLoader />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && !hasResume && (
        <>
          <EmptyState
            icon={FileText}
            title="No resumes uploaded"
            description="Upload your resume and we'll suggest jobs you can apply to based on your skills"
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data!.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onSetPrimary={setPrimaryMutation.mutate}
                loading={setPrimaryMutation.isPending}
              />
            ))}
          </div>

          {uploadMutation.isPending && (
            <Card className="border-cyan/20 bg-cyan/5">
              <p className="text-sm text-center text-muted animate-pulse">
                Analyzing resume & finding job matches...
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
        title="Upload Resume"
        description="Upload a PDF resume. We'll extract skills and find matching jobs."
      >
        <ResumeUploader
          onUpload={(file) => uploadMutation.mutate(file)}
          loading={uploadMutation.isPending}
        />
      </Modal>
    </div>
  )
}
