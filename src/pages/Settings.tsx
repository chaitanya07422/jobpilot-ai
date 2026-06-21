import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Send, ToggleLeft, ToggleRight, CreditCard } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export default function Settings() {
  const navigate = useNavigate()
  const subscription = useAuthStore((s) => s.subscription)
  const { jobPreferences, sourceConfig, telegramConnected, setJobPreferences, setSourceConfig } =
    useUIStore()
  const [saved, setSaved] = useState(false)
  const [roles, setRoles] = useState(jobPreferences.preferredRoles.join(', '))
  const [locations, setLocations] = useState(jobPreferences.preferredLocations.join(', '))
  const [minScore, setMinScore] = useState(jobPreferences.minimumMatchScore)
  const [autoApply, setAutoApply] = useState(jobPreferences.autoApply)
  const [sources, setSources] = useState(sourceConfig)

  const handleSave = () => {
    setJobPreferences({
      preferredRoles: roles.split(',').map((r) => r.trim()).filter(Boolean),
      preferredLocations: locations.split(',').map((l) => l.trim()).filter(Boolean),
      minimumMatchScore: minScore,
      autoApply,
    })
    setSourceConfig(sources)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-heading text-xl font-semibold">Settings</h2>
        <p className="text-sm text-muted mt-1">Configure job preferences and integrations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing & Subscription</CardTitle>
          <CardDescription>Manage your JobPilot AI plan</CardDescription>
        </CardHeader>
        <div className="flex items-center justify-between rounded-lg bg-panel-secondary px-4 py-3">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-cyan" />
            <div>
              <p className="text-sm font-medium">
                {subscription?.active
                  ? `${subscription.planId.charAt(0).toUpperCase()}${subscription.planId.slice(1)} Plan`
                  : 'No active plan'}
              </p>
              <p className="text-xs text-muted">
                {subscription?.active
                  ? `Renews ${formatDate(subscription.expiresAt)}`
                  : 'Subscribe to activate the pipeline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={subscription?.active ? 'green' : 'amber'}>
              {subscription?.active ? 'Active' : 'Inactive'}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => navigate('/pricing')}>
              {subscription?.active ? 'Change Plan' : 'Subscribe'}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Preferences</CardTitle>
          <CardDescription>Define criteria for job discovery and matching</CardDescription>
        </CardHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">Preferred Roles</label>
            <input
              type="text"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
              className="w-full rounded-lg border border-border bg-panel-secondary px-3 py-2 text-sm outline-none focus:border-cyan/50"
              placeholder="Backend Engineer, Senior Backend Engineer"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">Preferred Locations</label>
            <input
              type="text"
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              className="w-full rounded-lg border border-border bg-panel-secondary px-3 py-2 text-sm outline-none focus:border-cyan/50"
              placeholder="Bangalore, Remote"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              Minimum Match Score: <span className="font-mono text-cyan">{minScore}%</span>
            </label>
            <input
              type="range"
              min={50}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-cyan"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-panel-secondary px-4 py-3">
            <div>
              <p className="text-sm font-medium">Auto Apply</p>
              <p className="text-xs text-muted">Automatically apply to approved jobs above threshold</p>
            </div>
            <button
              onClick={() => setAutoApply(!autoApply)}
              disabled={!subscription?.active}
              className="text-cyan disabled:opacity-40"
              aria-label="Toggle auto apply"
            >
              {autoApply ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8 text-muted" />}
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Telegram Integration</CardTitle>
          <CardDescription>Receive notifications and approve jobs via Telegram</CardDescription>
        </CardHeader>
        <div className="flex items-center justify-between rounded-lg bg-panel-secondary px-4 py-3">
          <div className="flex items-center gap-3">
            <Send className="h-5 w-5 text-cyan" />
            <div>
              <p className="text-sm font-medium">Telegram Bot</p>
              <p className="text-xs text-muted">@JobPilotAIBot</p>
            </div>
          </div>
          <Badge variant={telegramConnected ? 'green' : 'muted'}>
            {telegramConnected ? 'Connected' : 'Not connected'}
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Source Configuration</CardTitle>
          <CardDescription>Enable or disable job discovery sources</CardDescription>
        </CardHeader>
        <div className="space-y-2">
          {(Object.keys(sources) as Array<keyof typeof sources>).map((key) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg bg-panel-secondary px-4 py-2.5"
            >
              <span className="text-sm capitalize">{key}</span>
              <button
                onClick={() => setSources((s) => ({ ...s, [key]: !s[key] }))}
                className="text-cyan"
                aria-label={`Toggle ${key}`}
              >
                {sources[key] ? (
                  <ToggleRight className="h-6 w-6" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-muted" />
                )}
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full sm:w-auto">
        <Save className="h-4 w-4" />
        {saved ? 'Saved!' : 'Save Changes'}
      </Button>
    </div>
  )
}
