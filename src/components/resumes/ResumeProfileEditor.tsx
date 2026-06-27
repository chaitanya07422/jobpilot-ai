import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type {
  EducationEntry,
  ExperienceEntry,
  OtherSectionEntry,
  ProjectEntry,
  ResumeProfile,
  UpdateResumeProfilePayload,
} from '@/types/resume.types'
import { parseCommaList, parseLineList } from '@/lib/resume-profile'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

const inputClass =
  'w-full rounded-lg border border-border bg-panel-secondary px-3 py-2 text-sm outline-none focus:border-cyan/50'

interface ResumeProfileEditorProps {
  profile: ResumeProfile
  saving?: boolean
  confirming?: boolean
  onSave: (payload: UpdateResumeProfilePayload) => void
  onConfirm: (payload: UpdateResumeProfilePayload) => void
}

function emptyExperience(): ExperienceEntry {
  return {
    company: '',
    role: '',
    highlights: [],
    technologies: [],
  }
}

function emptyEducation(): EducationEntry {
  return { institution: '' }
}

function emptyProject(): ProjectEntry {
  return { name: '', technologies: [] }
}

function emptyOtherSection(): OtherSectionEntry {
  return { title: '', items: [] }
}

function profileToFormState(profile: ResumeProfile) {
  return {
    summary: profile.summary ?? '',
    totalYearsExperience:
      profile.totalYearsExperience !== undefined
        ? String(profile.totalYearsExperience)
        : '',
    skills: profile.skills.join(', '),
    technologies: profile.technologies.join(', '),
    experience: profile.experience.length > 0 ? profile.experience : [emptyExperience()],
    education: profile.education.length > 0 ? profile.education : [emptyEducation()],
    projects: profile.projects.length > 0 ? profile.projects : [emptyProject()],
    certifications: profile.certifications.join(', '),
    languages: profile.languages.join(', '),
    otherSections:
      profile.otherSections.length > 0 ? profile.otherSections : [emptyOtherSection()],
  }
}

function formStateToPayload(form: ReturnType<typeof profileToFormState>): UpdateResumeProfilePayload {
  return {
    summary: form.summary.trim() || undefined,
    totalYearsExperience: form.totalYearsExperience.trim()
      ? Number(form.totalYearsExperience)
      : undefined,
    skills: parseCommaList(form.skills),
    technologies: parseCommaList(form.technologies),
    experience: form.experience
      .filter((entry) => entry.company.trim() || entry.role.trim())
      .map((entry) => ({
        ...entry,
        company: entry.company.trim(),
        role: entry.role.trim(),
        location: entry.location?.trim() || undefined,
        startDate: entry.startDate?.trim() || undefined,
        endDate: entry.endDate?.trim() || undefined,
        highlights: entry.highlights.filter(Boolean),
        technologies: entry.technologies.filter(Boolean),
      })),
    education: form.education
      .filter((entry) => entry.institution.trim())
      .map((entry) => ({
        ...entry,
        institution: entry.institution.trim(),
        degree: entry.degree?.trim() || undefined,
        field: entry.field?.trim() || undefined,
        startDate: entry.startDate?.trim() || undefined,
        endDate: entry.endDate?.trim() || undefined,
        grade: entry.grade?.trim() || undefined,
      })),
    projects: form.projects
      .filter((entry) => entry.name.trim())
      .map((entry) => ({
        ...entry,
        name: entry.name.trim(),
        description: entry.description?.trim() || undefined,
        url: entry.url?.trim() || undefined,
        technologies: entry.technologies.filter(Boolean),
      })),
    certifications: parseCommaList(form.certifications),
    languages: parseCommaList(form.languages),
    otherSections: form.otherSections
      .filter((entry) => entry.title.trim() || entry.items.length > 0)
      .map((entry) => ({
        title: entry.title.trim(),
        items: entry.items.filter(Boolean),
      })),
  }
}

export function ResumeProfileEditor({
  profile,
  saving,
  confirming,
  onSave,
  onConfirm,
}: ResumeProfileEditorProps) {
  const [form, setForm] = useState(() => profileToFormState(profile))

  useEffect(() => {
    setForm(profileToFormState(profile))
  }, [profile])

  const isConfirmed = profile.extractionStatus === 'confirmed'
  const payload = () => formStateToPayload(form)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Professional summary extracted from your resume</CardDescription>
        </CardHeader>
        <textarea
          rows={4}
          value={form.summary}
          onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
          className={inputClass}
          placeholder="Brief professional summary"
        />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience overview</CardTitle>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              Total years of experience
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={form.totalYearsExperience}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, totalYearsExperience: e.target.value }))
              }
              className={inputClass}
              placeholder="e.g. 4"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">Skills</label>
            <input
              value={form.skills}
              onChange={(e) => setForm((prev) => ({ ...prev, skills: e.target.value }))}
              className={inputClass}
              placeholder="System Design, Leadership"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-muted mb-1.5 block">Technologies</label>
            <input
              value={form.technologies}
              onChange={(e) => setForm((prev) => ({ ...prev, technologies: e.target.value }))}
              className={inputClass}
              placeholder="React, Node.js, PostgreSQL"
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Work experience</CardTitle>
              <CardDescription>Roles, companies, and highlights</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  experience: [...prev.experience, emptyExperience()],
                }))
              }
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </CardHeader>
        <div className="space-y-4">
          {form.experience.map((entry, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-panel-secondary p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Role {index + 1}</p>
                {form.experience.length > 1 && (
                  <button
                    type="button"
                    className="text-muted hover:text-red"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        experience: prev.experience.filter((_, i) => i !== index),
                      }))
                    }
                    aria-label="Remove experience"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={entry.company}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      experience: prev.experience.map((item, i) =>
                        i === index ? { ...item, company: e.target.value } : item,
                      ),
                    }))
                  }
                  className={inputClass}
                  placeholder="Company"
                />
                <input
                  value={entry.role}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      experience: prev.experience.map((item, i) =>
                        i === index ? { ...item, role: e.target.value } : item,
                      ),
                    }))
                  }
                  className={inputClass}
                  placeholder="Role / title"
                />
                <input
                  value={entry.location ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      experience: prev.experience.map((item, i) =>
                        i === index ? { ...item, location: e.target.value } : item,
                      ),
                    }))
                  }
                  className={inputClass}
                  placeholder="Location"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={entry.startDate ?? ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        experience: prev.experience.map((item, i) =>
                          i === index ? { ...item, startDate: e.target.value } : item,
                        ),
                      }))
                    }
                    className={inputClass}
                    placeholder="Start"
                  />
                  <input
                    value={entry.endDate ?? ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        experience: prev.experience.map((item, i) =>
                          i === index ? { ...item, endDate: e.target.value } : item,
                        ),
                      }))
                    }
                    className={inputClass}
                    placeholder="End"
                  />
                </div>
              </div>
              <textarea
                rows={3}
                value={entry.highlights.join('\n')}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    experience: prev.experience.map((item, i) =>
                      i === index
                        ? { ...item, highlights: parseLineList(e.target.value) }
                        : item,
                    ),
                  }))
                }
                className={inputClass}
                placeholder="Highlights (one per line)"
              />
              <input
                value={entry.technologies.join(', ')}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    experience: prev.experience.map((item, i) =>
                      i === index
                        ? { ...item, technologies: parseCommaList(e.target.value) }
                        : item,
                    ),
                  }))
                }
                className={inputClass}
                placeholder="Technologies used"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Education</CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  education: [...prev.education, emptyEducation()],
                }))
              }
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </CardHeader>
        <div className="space-y-4">
          {form.education.map((entry, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-panel-secondary p-4 space-y-3"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={entry.institution}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      education: prev.education.map((item, i) =>
                        i === index ? { ...item, institution: e.target.value } : item,
                      ),
                    }))
                  }
                  className={inputClass}
                  placeholder="Institution"
                />
                <input
                  value={entry.degree ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      education: prev.education.map((item, i) =>
                        i === index ? { ...item, degree: e.target.value } : item,
                      ),
                    }))
                  }
                  className={inputClass}
                  placeholder="Degree"
                />
                <input
                  value={entry.field ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      education: prev.education.map((item, i) =>
                        i === index ? { ...item, field: e.target.value } : item,
                      ),
                    }))
                  }
                  className={inputClass}
                  placeholder="Field of study"
                />
                <input
                  value={entry.grade ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      education: prev.education.map((item, i) =>
                        i === index ? { ...item, grade: e.target.value } : item,
                      ),
                    }))
                  }
                  className={inputClass}
                  placeholder="Grade / GPA"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Projects</CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  projects: [...prev.projects, emptyProject()],
                }))
              }
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </CardHeader>
        <div className="space-y-4">
          {form.projects.map((entry, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-panel-secondary p-4 space-y-3"
            >
              <input
                value={entry.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    projects: prev.projects.map((item, i) =>
                      i === index ? { ...item, name: e.target.value } : item,
                    ),
                  }))
                }
                className={inputClass}
                placeholder="Project name"
              />
              <textarea
                rows={2}
                value={entry.description ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    projects: prev.projects.map((item, i) =>
                      i === index ? { ...item, description: e.target.value } : item,
                    ),
                  }))
                }
                className={inputClass}
                placeholder="Description"
              />
              <input
                value={entry.technologies.join(', ')}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    projects: prev.projects.map((item, i) =>
                      i === index
                        ? { ...item, technologies: parseCommaList(e.target.value) }
                        : item,
                    ),
                  }))
                }
                className={inputClass}
                placeholder="Technologies"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional details</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">Certifications</label>
            <input
              value={form.certifications}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, certifications: e.target.value }))
              }
              className={inputClass}
              placeholder="AWS Solutions Architect, CKA"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">Languages</label>
            <input
              value={form.languages}
              onChange={(e) => setForm((prev) => ({ ...prev, languages: e.target.value }))}
              className={inputClass}
              placeholder="English, Hindi"
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-background/90 backdrop-blur-sm p-4 rounded-xl border border-border">
        <Button
          variant="outline"
          loading={saving}
          disabled={confirming}
          onClick={() => onSave(payload())}
          className="flex-1"
        >
          Save changes
        </Button>
        {!isConfirmed && (
          <Button
            loading={confirming}
            disabled={saving}
            onClick={() => onConfirm(payload())}
            className="flex-1"
          >
            Confirm profile
          </Button>
        )}
      </div>
    </div>
  )
}
