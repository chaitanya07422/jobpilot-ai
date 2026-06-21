import type { SkillGap } from '@/types/activity.types'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface SkillGapCardProps {
  skills: SkillGap[]
  totalIncrease: number
}

export function SkillGapCard({ skills, totalIncrease }: SkillGapCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Missing Skills</CardTitle>
        <p className="text-sm text-muted mt-1">
          Adding these skills could increase matches by{' '}
          <span className="font-mono text-green font-semibold">+{totalIncrease}%</span>
        </p>
      </CardHeader>
      <div className="space-y-3">
        {skills.map((skill, i) => (
          <div key={skill.skill} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted w-4">{i + 1}</span>
              <Badge variant="amber">{skill.skill}</Badge>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-green">+{skill.potentialIncrease}% match</p>
              <p className="text-[10px] text-muted">in {skill.frequency} job listings</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function PotentialMatchIncrease({ value }: { value: number }) {
  return (
    <Card className="bg-gradient-to-br from-cyan/5 to-green/5 border-cyan/20">
      <CardHeader>
        <CardTitle>Potential Match Increase</CardTitle>
      </CardHeader>
      <div className="flex items-end gap-2">
        <span className="font-mono text-5xl font-bold text-green">+{value}%</span>
        <span className="text-sm text-muted mb-2">by closing skill gaps</span>
      </div>
      <p className="text-xs text-muted mt-3">
        Focus on Kafka, AWS, and Kubernetes to unlock the highest-impact matches.
      </p>
    </Card>
  )
}
