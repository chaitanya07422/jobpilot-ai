import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle, Zap } from 'lucide-react'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/authStore'
import { AuthShell } from '@/components/layout/PageShell'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/Loader'

export default function AuthCallback() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const [error, setError] = useState('')

  useEffect(() => {
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash
    const accessToken = new URLSearchParams(hash).get('accessToken')

    if (!accessToken) {
      setError('Sign in failed. No access token received.')
      return
    }

    authApi
      .me(accessToken)
      .then(({ user }) => {
        setSession(accessToken, user)
        window.history.replaceState(null, '', window.location.pathname)
        navigate('/dashboard', { replace: true })
      })
      .catch(() => {
        setError('Sign in failed. Could not load your profile.')
      })
  }, [navigate, setSession])

  if (error) {
    return (
      <AuthShell>
        <div className="w-full max-w-md animate-fade-in">
          <Card className="text-center space-y-4">
            <XCircle className="h-12 w-12 text-red mx-auto" />
            <p className="text-sm text-muted">{error}</p>
          </Card>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <div className="text-center space-y-4">
        <Zap className="h-8 w-8 text-cyan mx-auto" />
        <PageLoader />
        <p className="text-sm text-muted">Completing Google sign in...</p>
      </div>
    </AuthShell>
  )
}
