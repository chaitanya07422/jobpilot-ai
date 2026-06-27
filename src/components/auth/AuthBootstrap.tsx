import { useEffect, useState } from 'react'
import { JobPilotLogo } from '@/components/brand/JobPilotLogo'
import { useAuthStore } from '@/store/authStore'
import { Loader } from '@/components/ui/Loader'

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const bootstrap = useAuthStore((s) => s.bootstrap)
  const authReady = useAuthStore((s) => s.authReady)
  const [hydrated, setHydrated] = useState(
    () => useAuthStore.persist.hasHydrated(),
  )

  useEffect(() => {
    if (hydrated) return

    return useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })
  }, [hydrated])

  useEffect(() => {
    if (!hydrated) return
    void bootstrap()
  }, [hydrated, bootstrap])

  if (!hydrated || !authReady) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <JobPilotLogo className="max-w-[180px]" />
        <Loader size="md" label="Loading session..." />
      </div>
    )
  }

  return <>{children}</>
}
