import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Lock, ArrowRight } from 'lucide-react'
import { JobPilotLogo } from '@/components/brand/JobPilotLogo'
import { authApi } from '@/api/auth.api'
import { ApiError } from '@/api/client'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { useAuthStore } from '@/store/authStore'
import { AuthShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import CheckEmail from '@/pages/CheckEmail'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const register = useAuthStore((s) => s.register)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(name, email, password)
      setRegisteredEmail(email)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Registration failed. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!registeredEmail) return
    setResendLoading(true)
    setResendMessage('')
    try {
      await authApi.resendVerification(registeredEmail)
      setResendMessage('Verification email sent.')
    } catch {
      setResendMessage('Could not resend. Try again later.')
    } finally {
      setResendLoading(false)
    }
  }

  if (registeredEmail) {
    return (
      <CheckEmail
        email={registeredEmail}
        onResend={handleResend}
        resendLoading={resendLoading}
        resendMessage={resendMessage}
      />
    )
  }

  return (
    <AuthShell>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <JobPilotLogo className="mx-auto mb-6 max-w-[220px]" />
          <h1 className="font-heading text-2xl font-bold">Create account</h1>
          <p className="text-sm text-muted mt-2">Start automating your job search</p>
        </div>

        <Card>
          <div className="space-y-4">
            <GoogleSignInButton />

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">Full Name</label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-panel-secondary px-3 py-2">
                <User className="h-4 w-4 text-muted shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">Email</label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-panel-secondary px-3 py-2">
                <Mail className="h-4 w-4 text-muted shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-panel-secondary px-3 py-2">
                <Lock className="h-4 w-4 text-muted shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red">{error}</p>}

            <Button type="submit" className="w-full" loading={loading}>
              Create Account <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          </div>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </AuthShell>
  )
}
