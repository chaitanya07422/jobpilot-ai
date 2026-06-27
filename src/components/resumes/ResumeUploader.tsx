import { useCallback, useRef, useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface ResumeUploaderProps {
  onUpload: (file: File) => void
  loading?: boolean
  loadingLabel?: string
}

export function ResumeUploader({ onUpload, loading, loadingLabel }: ResumeUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        onUpload(file)
      }
    },
    [onUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        'rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200',
        dragOver ? 'border-cyan bg-cyan/5' : 'border-border bg-panel hover:border-cyan/30',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
        disabled={loading}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-panel-secondary border border-border">
          {dragOver ? <Upload className="h-6 w-6 text-cyan" /> : <FileText className="h-6 w-6 text-muted" />}
        </div>
        <div>
          <p className="text-sm font-medium">Drop your resume here</p>
          <p className="text-xs text-muted mt-1">PDF files only, max 5MB</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          loading={loading}
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          {loading ? (loadingLabel ?? 'Uploading...') : 'Browse Files'}
        </Button>
      </div>
    </div>
  )
}
