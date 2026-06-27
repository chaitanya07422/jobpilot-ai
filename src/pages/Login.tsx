import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react'
import { authApi } from '@/api/auth.api'
import { ApiError } from '@/api/client'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { useAuthStore } from '@/store/authStore'
import { AuthShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [resendLoading, setResendLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const successMessage = (location.state as { message?: string } | null)?.message

  useEffect(() => {
    if (searchParams.get('error') === 'google_auth_failed') {
      const reason = searchParams.get('reason')
      setError(
        reason
          ? `Google sign in failed: ${decodeURIComponent(reason)}`
          : 'Google sign in failed. Please try again.',
      )
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setUnverifiedEmail(null)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError('Please verify your email before signing in.')
        setUnverifiedEmail(email)
      } else {
        setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!unverifiedEmail) return
    setResendLoading(true)
    try {
      await authApi.resendVerification(unverifiedEmail)
      setError('Verification email sent. Check your inbox.')
    } catch {
      setError('Could not resend verification email.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <AuthShell>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/20 mb-4">
            <Zap className="h-6 w-6 text-cyan" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted mt-2">Sign in to JobPilot AI</p>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-muted">Password</label>
                <Link to="/forgot-password" className="text-xs text-cyan hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-panel-secondary px-3 py-2">
                <Lock className="h-4 w-4 text-muted shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                  required
                />
              </div>
            </div>

            {successMessage && <p className="text-sm text-green">{successMessage}</p>}

            {error && <p className="text-sm text-red">{error}</p>}

            {unverifiedEmail && (
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                loading={resendLoading}
                onClick={handleResend}
              >
                Resend verification email
              </Button>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          </div>

          <p className="text-center text-sm text-muted mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-cyan hover:underline">
              Create account
            </Link>
          </p>
        </Card>
      </div>
    </AuthShell>
  )
}
