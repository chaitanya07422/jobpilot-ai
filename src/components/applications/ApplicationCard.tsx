import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MapPin } from 'lucide-react'
import type { Application } from '@/types/application.types'
import { getScoreBg } from '@/lib/utils'

interface ApplicationCardProps {
  application: Application
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-border bg-panel p-3 shadow-sm cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-muted hover:text-foreground shrink-0"
          aria-label="Drag"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{application.company}</p>
          <p className="text-xs text-muted mt-0.5 truncate">{application.role}</p>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-muted">
            <MapPin className="h-3 w-3" />
            {application.location}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getScoreBg(application.matchScore)}`}>
              {application.matchScore}%
            </span>
            {application.notes && (
              <span className="text-[10px] text-muted truncate max-w-[100px]">{application.notes}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
