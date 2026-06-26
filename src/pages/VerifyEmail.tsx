import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Zap } from 'lucide-react'
import { authApi } from '@/api/auth.api'
import { AuthShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/Loader'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error',
  )
  const [message, setMessage] = useState(
    token ? '' : 'Verification link is invalid or missing.',
  )

  useEffect(() => {
    if (!token) return

    authApi
      .verifyEmail(token)
      .then(() => {
        setStatus('success')
        setMessage('Your email has been verified. You can now sign in.')
      })
      .catch((err: Error) => {
        setStatus('error')
        setMessage(err.message || 'Verification failed. The link may have expired.')
      })
  }, [token])

  if (status === 'loading') {
    return (
      <AuthShell>
        <PageLoader />
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/20 mb-4">
            <Zap className="h-6 w-6 text-cyan" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Email verification</h1>
        </div>

        <Card className="text-center space-y-4">
          {status === 'success' ? (
            <CheckCircle className="h-12 w-12 text-green mx-auto" />
          ) : (
            <XCircle className="h-12 w-12 text-red mx-auto" />
          )}
          <p className="text-sm text-muted">{message}</p>
          {status === 'success' ? (
            <Button className="w-full" onClick={() => navigate('/login')}>
              Go to sign in
            </Button>
          ) : (
            <Link to="/login" className="text-cyan text-sm hover:underline block">
              Back to sign in
            </Link>
          )}
        </Card>
      </div>
    </AuthShell>
  )
}
