import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Lock, Zap } from 'lucide-react'
import { authApi } from '@/api/auth.api'
import { ApiError } from '@/api/client'
import { AuthShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Reset link is invalid or missing.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await authApi.resetPassword(token, password)
      navigate('/login', { state: { message: 'Password updated. Please sign in.' } })
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Reset failed. The link may have expired.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/20 mb-4">
            <Zap className="h-6 w-6 text-cyan" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Reset password</h1>
          <p className="text-sm text-muted mt-2">Choose a new password for your account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">
                New password
              </label>
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

            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">
                Confirm password
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-panel-secondary px-3 py-2">
                <Lock className="h-4 w-4 text-muted shrink-0" />
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red">{error}</p>}

            <Button type="submit" className="w-full" loading={loading} disabled={!token}>
              Update password <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="text-center text-sm text-muted">
              <Link to="/login" className="text-cyan hover:underline">
                Back to sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </AuthShell>
  )
}
