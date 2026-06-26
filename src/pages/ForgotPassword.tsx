import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, Zap } from 'lucide-react'
import { authApi } from '@/api/auth.api'
import { ApiError } from '@/api/client'
import { AuthShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authApi.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Request failed. Please try again.',
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
          <h1 className="font-heading text-2xl font-bold">Forgot password</h1>
          <p className="text-sm text-muted mt-2">
            {sent
              ? 'Check your email for a reset link'
              : 'Enter your email and we will send a reset link'}
          </p>
        </div>

        <Card>
          {sent ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted">
                If an account exists for <span className="text-text">{email}</span>, you
                will receive a password reset link shortly.
              </p>
              <Link to="/login">
                <Button className="w-full">Back to sign in</Button>
              </Link>
            </div>
          ) : (
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

              {error && <p className="text-sm text-red">{error}</p>}

              <Button type="submit" className="w-full" loading={loading}>
                Send reset link <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-center text-sm text-muted">
                <Link to="/login" className="text-cyan hover:underline">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </Card>
      </div>
    </AuthShell>
  )
}
