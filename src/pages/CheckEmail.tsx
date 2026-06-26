import { Link } from 'react-router-dom'
import { Mail, Zap } from 'lucide-react'
import { AuthShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface CheckEmailProps {
  email: string
  onResend?: () => void
  resendLoading?: boolean
  resendMessage?: string
}

export default function CheckEmail({
  email,
  onResend,
  resendLoading,
  resendMessage,
}: CheckEmailProps) {
  return (
    <AuthShell>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/20 mb-4">
            <Zap className="h-6 w-6 text-cyan" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Check your email</h1>
          <p className="text-sm text-muted mt-2">
            We sent a verification link to <span className="text-text">{email}</span>
          </p>
        </div>

        <Card className="text-center space-y-4">
          <Mail className="h-12 w-12 text-cyan mx-auto" />
          <p className="text-sm text-muted">
            Click the link in the email to verify your account, then sign in.
          </p>
          {resendMessage && <p className="text-sm text-green">{resendMessage}</p>}
          {onResend && (
            <Button
              variant="secondary"
              className="w-full"
              loading={resendLoading}
              onClick={onResend}
            >
              Resend verification email
            </Button>
          )}
          <Link to="/login">
            <Button variant="ghost" className="w-full">
              Back to sign in
            </Button>
          </Link>
        </Card>
      </div>
    </AuthShell>
  )
}
