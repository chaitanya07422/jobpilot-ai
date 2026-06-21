import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { AuthShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const ok = await login(email, password)
      if (ok) navigate('/dashboard')
      else setError('Invalid credentials')
    } catch {
      setError('Login failed. Please try again.')
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
          <h1 className="font-heading text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted mt-2">Sign in to JobPilot AI</p>
        </div>

        <Card>
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
              <label className="text-xs font-medium text-muted mb-1.5 block">Password</label>
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

            {error && <p className="text-sm text-red">{error}</p>}

            <Button type="submit" className="w-full" loading={loading}>
              Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

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
