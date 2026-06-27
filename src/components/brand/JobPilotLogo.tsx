import jobPilotLogo from '@/assets/Job-pilot.png'
import { cn } from '@/lib/utils'

interface JobPilotLogoProps {
  className?: string
  alt?: string
}

export function JobPilotLogo({
  className,
  alt = 'JobPilot AI',
}: JobPilotLogoProps) {
  return (
    <img
      src={jobPilotLogo}
      alt={alt}
      className={cn('h-auto w-full object-contain', className)}
    />
  )
}
