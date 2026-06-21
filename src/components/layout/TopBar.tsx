import { useLocation } from 'react-router-dom'
import { Bell, Search, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { SidebarToggle } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/jobs': 'Jobs',
  '/applications': 'Applications',
  '/approvals': 'Approvals',
  '/resumes': 'Resumes',
  '/insights': 'Insights',
  '/activity': 'Activity',
  '/settings': 'Settings',
  '/pricing': 'Billing',
}

export function TopBar() {
  const location = useLocation()
  const { user, logout, subscription } = useAuthStore()
  const { automationPaused } = useUIStore()
  const isSubscribed = subscription?.active === true

  const title =
    pageTitles[location.pathname] ??
    (location.pathname.startsWith('/jobs/') ? 'Job Detail' : 'JobPilot AI')

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <SidebarToggle />
        <div>
          <h1 className="font-heading text-lg font-semibold">{title}</h1>
          <p className="text-xs text-muted hidden sm:block">
            {!isSubscribed
              ? 'Pipeline inactive — subscribe to activate'
              : automationPaused
                ? 'Automation paused'
                : 'Automation running'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-1.5">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Quick search..."
            className="bg-transparent text-sm outline-none placeholder:text-muted w-40 lg:w-56"
          />
        </div>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium leading-none">{user?.name ?? 'User'}</p>
            <p className="text-[10px] text-muted mt-0.5">{user?.email}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan/10 border border-cyan/20 text-xs font-bold text-cyan">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
