export type ApplicationStage =
  | 'pending'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected'

export interface Application {
  id: string
  jobId: string
  company: string
  role: string
  location: string
  matchScore: number
  stage: ApplicationStage
  appliedAt?: string
  updatedAt: string
  notes?: string
}
