import type { Activity } from '@/types/activity.types'
import { ActivityItem } from '@/components/activity/ActivityItem'

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="rounded-xl border border-border bg-panel p-5">
      {activities.map((activity, i) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          isLast={i === activities.length - 1}
        />
      ))}
    </div>
  )
}
