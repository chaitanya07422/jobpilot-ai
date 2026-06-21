import { Star, FileText, Calendar } from 'lucide-react'
import type { Resume } from '@/types/resume.types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface ResumeCardProps {
  resume: Resume
  onSetPrimary: (id: string) => void
  loading?: boolean
}

export function ResumeCard({ resume, onSetPrimary, loading }: ResumeCardProps) {
  return (
    <Card className={resume.isPrimary ? 'border-cyan/30 shadow-lg shadow-cyan/5' : ''}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-panel-secondary border border-border">
            <FileText className="h-5 w-5 text-cyan" />
          </div>
          <div>
            <p className="font-heading font-semibold">{resume.name}</p>
            <p className="text-xs text-muted mt-0.5">{resume.fileName}</p>
          </div>
        </div>
        {resume.isPrimary && (
          <Badge variant="cyan">
            <Star className="h-3 w-3 mr-1" /> Primary
          </Badge>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs text-muted mb-2">Skills Extracted</p>
        <div className="flex flex-wrap gap-1.5">
          {resume.skillsExtracted.map((skill) => (
            <Badge key={skill} variant="muted">{skill}</Badge>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(resume.uploadDate)}
        </div>
        <span>{resume.fileSize}</span>
      </div>

      {!resume.isPrimary && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full"
          loading={loading}
          onClick={() => onSetPrimary(resume.id)}
        >
          Set as Primary
        </Button>
      )}
    </Card>
  )
}
