import { NavLink, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  BarChart3,
  Activity,
  Settings,
  CheckCircle2,
  Menu,
  X,
  Send,
  Pause,
  Play,
  CreditCard,
  Sparkles,
} from 'lucide-react'
import { JobPilotLogo } from '@/components/brand/JobPilotLogo'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { resumesApi } from '@/api/resumes.api'
import { Button } from '@/components/ui/Button'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/applications', label: 'Applications', icon: FileText },
  { to: '/approvals', label: 'Approvals', icon: CheckCircle2 },
  { to: '/resumes', label: 'Resumes', icon: FileText },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/pricing', label: 'Billing', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const navigate = useNavigate()
  const { sidebarOpen, setSidebarOpen, automationPaused, toggleAutomation, telegramConnected } =
    useUIStore()
  const isSubscribed = useAuthStore((s) => s.subscription?.active === true)

  const { data: resumes } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumesApi.getAll,
  })
  const hasResume = (resumes?.length ?? 0) > 0

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-panel transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <JobPilotLogo className="max-w-[132px]" />
          <button
            className="lg:hidden text-muted hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isSubscribed && (
          <div className="mx-3 mt-3 rounded-lg border border-amber/20 bg-amber/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber" />
              <p className="text-xs font-medium text-amber">
                {hasResume ? 'Matches ready' : 'Get started'}
              </p>
            </div>
            <p className="text-[10px] text-muted mb-2">
              {hasResume
                ? 'Subscribe to unlock jobs & auto-apply'
                : 'Upload resume for job suggestions'}
            </p>
            <Button
              size="sm"
              className="w-full h-7 text-xs"
              onClick={() => navigate(hasResume ? '/pricing' : '/resumes')}
            >
              {hasResume ? 'Unlock & Auto-Apply' : 'Upload Resume'}
            </Button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-cyan/10 text-cyan border border-cyan/20'
                    : 'text-muted hover:bg-panel-secondary hover:text-foreground',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4 space-y-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-panel-secondary px-3 py-2.5">
            <Send className="h-4 w-4 text-cyan shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">Telegram</p>
              <p className="text-[10px] text-muted">
                {telegramConnected ? (
                  <span className="text-green">Connected</span>
                ) : (
                  <span className="text-muted">Not connected</span>
                )}
              </p>
            </div>
            <div
              className={cn(
                'ml-auto h-2 w-2 rounded-full shrink-0',
                telegramConnected ? 'bg-green animate-pulse-ring' : 'bg-border',
              )}
            />
          </div>

          <div className="rounded-lg bg-panel-secondary px-3 py-2.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium">Auto Apply</p>
              <span
                className={cn(
                  'text-[10px] font-medium',
                  !isSubscribed || automationPaused ? 'text-amber' : 'text-green',
                )}
              >
                {!isSubscribed ? 'Inactive' : automationPaused ? 'Paused' : 'Active'}
              </span>
            </div>
            <button
              onClick={toggleAutomation}
              disabled={!isSubscribed}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-md py-1.5 text-xs font-medium transition-all',
                !isSubscribed
                  ? 'bg-panel border border-border text-muted cursor-not-allowed'
                  : automationPaused
                    ? 'bg-green/10 text-green border border-green/20 hover:bg-green/20'
                    : 'bg-amber/10 text-amber border border-amber/20 hover:bg-amber/20',
              )}
            >
              {!isSubscribed ? (
                'Subscribe to enable'
              ) : automationPaused ? (
                <>
                  <Play className="h-3 w-3" /> Resume Automation
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3" /> Pause Automation
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export function SidebarToggle() {
  const { toggleSidebar } = useUIStore()
  return (
    <button
      className="lg:hidden text-muted hover:text-foreground p-1"
      onClick={toggleSidebar}
      aria-label="Open sidebar"
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}
