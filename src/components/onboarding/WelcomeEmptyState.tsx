import { useNavigate } from 'react-router-dom'
import { FileText, Sparkles, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function WelcomeEmptyState() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isNewUser = useAuthStore((s) => s.isNewUser)

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <Card className="border-cyan/20 bg-gradient-to-br from-cyan/5 via-panel to-panel overflow-hidden relative text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative py-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/20 mb-4">
            <FileText className="h-7 w-7 text-cyan" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            {isNewUser && <Badge variant="cyan">New account</Badge>}
          </div>
          <h2 className="font-heading text-2xl font-bold">
            Welcome{user?.name ? `, ${user.name}` : ''}!
          </h2>
          <p className="text-muted mt-3 max-w-md mx-auto">
            Upload your resume to get AI-powered job suggestions. We&apos;ll match you with
            backend engineering roles at top companies — subscribe later to unlock auto-apply.
          </p>
          <Button className="mt-6" onClick={() => navigate('/resumes')}>
            Upload Resume <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <div className="grid sm:grid-cols-3 gap-4 text-center">
        {[
          { step: '1', title: 'Upload resume', desc: 'AI extracts your skills' },
          { step: '2', title: 'See matches', desc: 'Preview blurred job suggestions' },
          { step: '3', title: 'Subscribe', desc: 'Unlock details & auto-apply' },
        ].map((item) => (
          <Card key={item.step} className="p-4">
            <span className="font-mono text-xs text-cyan">Step {item.step}</span>
            <p className="font-heading font-semibold text-sm mt-2">{item.title}</p>
            <p className="text-xs text-muted mt-1">{item.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="border-border flex items-center gap-3 p-4">
        <Sparkles className="h-5 w-5 text-muted shrink-0" />
        <p className="text-sm text-muted">
          No resume yet — job suggestions will appear here once you upload.
        </p>
      </Card>
    </div>
  )
}
