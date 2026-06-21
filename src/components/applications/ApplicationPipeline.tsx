import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Application, ApplicationStage } from '@/types/application.types'
import { applicationsApi } from '@/api/applications.api'
import { ApplicationCard } from '@/components/applications/ApplicationCard'
import { cn } from '@/lib/utils'

const columns: Array<{ id: ApplicationStage; label: string; color: string }> = [
  { id: 'pending', label: 'Pending', color: 'border-amber/30' },
  { id: 'applied', label: 'Applied', color: 'border-cyan/30' },
  { id: 'interview', label: 'Interview', color: 'border-green/30' },
  { id: 'offer', label: 'Offer', color: 'border-cyan/30' },
  { id: 'rejected', label: 'Rejected', color: 'border-red/30' },
]

interface ColumnProps {
  col: (typeof columns)[number]
  items: Application[]
}

function PipelineColumn({ col, items }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-shrink-0 w-64 rounded-xl border bg-panel-secondary/50 p-3 transition-colors',
        col.color,
        isOver && 'border-cyan/50 bg-cyan/5',
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">{col.label}</h3>
        <span className="font-mono text-xs text-muted bg-panel rounded-md px-1.5 py-0.5">
          {items.length}
        </span>
      </div>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[120px]">
          {items.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

interface ApplicationPipelineProps {
  applications: Application[]
}

export function ApplicationPipeline({ applications }: ApplicationPipelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const mutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: ApplicationStage }) =>
      applicationsApi.updateStage(id, stage),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })

  const activeApp = applications.find((a) => a.id === activeId)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const appId = active.id as string
    const overId = over.id as string
    const currentApp = applications.find((a) => a.id === appId)
    if (!currentApp) return

    const targetStage = columns.find((c) => c.id === overId)?.id
    if (targetStage && targetStage !== currentApp.stage) {
      mutation.mutate({ id: appId, stage: targetStage })
      return
    }

    const overApp = applications.find((a) => a.id === overId)
    if (overApp && overApp.stage !== currentApp.stage) {
      mutation.mutate({ id: appId, stage: overApp.stage })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <PipelineColumn
            key={col.id}
            col={col}
            items={applications.filter((a) => a.stage === col.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApp && <ApplicationCard application={activeApp} />}
      </DragOverlay>
    </DndContext>
  )
}
