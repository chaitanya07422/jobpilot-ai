export type ExtractionStatus =
  | 'pending'
  | 'processing'
  | 'ready_for_review'
  | 'confirmed'
  | 'failed'

export interface ExperienceEntry {
  company: string
  role: string
  location?: string
  startDate?: string
  endDate?: string
  highlights: string[]
  technologies: string[]
}

export interface EducationEntry {
  institution: string
  degree?: string
  field?: string
  startDate?: string
  endDate?: string
  grade?: string
}

export interface ProjectEntry {
  name: string
  description?: string
  technologies: string[]
  url?: string
}

export interface OtherSectionEntry {
  title: string
  items: string[]
}

export interface ResumeProfile {
  resumeId: string
  extractionStatus: ExtractionStatus
  extractionError?: string
  summary?: string
  totalYearsExperience?: number
  skills: string[]
  technologies: string[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
  projects: ProjectEntry[]
  certifications: string[]
  languages: string[]
  otherSections: OtherSectionEntry[]
  profileConfirmedAt?: string
}

export type UpdateResumeProfilePayload = Partial<
  Pick<
    ResumeProfile,
    | 'summary'
    | 'totalYearsExperience'
    | 'skills'
    | 'technologies'
    | 'experience'
    | 'education'
    | 'projects'
    | 'certifications'
    | 'languages'
    | 'otherSections'
  >
>

export interface Resume {
  id: string
  name: string
  fileName: string
  url: string
  skillsExtracted: string[]
  uploadDate: string
  isPrimary: boolean
  fileSize: string
  extractionStatus?: ExtractionStatus
  extractionError?: string
  profile?: ResumeProfile
}
