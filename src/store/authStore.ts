import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi, type AuthUser } from '@/api/auth.api'
import { ApiError } from '@/api/client'
import {
  registerSessionHandlers,
  sessionToken,
} from '@/lib/session-token'
import type { Subscription } from '@/types/subscription.types'

interface User {
  id: string
  name: string
  email: string
  emailVerified?: boolean
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  authReady: boolean
  subscription: Subscription | null
  isNewUser: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  setSession: (accessToken: string, user: AuthUser) => void
  bootstrap: () => Promise<void>
  activateSubscription: (subscription: Subscription) => void
  clearNewUserFlag: () => void
  logout: () => Promise<void>
}

function toStoreUser(user: AuthUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
  }
}

function toSubscription(user: AuthUser): Subscription | null {
  if (!user.subscription?.active) return null

  return {
    planId: user.subscription.planId as Subscription['planId'],
    active: true,
    activatedAt: user.subscription.activatedAt ?? '',
    expiresAt: user.subscription.expiresAt ?? '',
  }
}

function applyAuthUser(user: AuthUser) {
  return {
    user: toStoreUser(user),
    isAuthenticated: true,
    isNewUser: user.isNewUser,
    subscription: toSubscription(user),
  }
}

function clearAuthState() {
  sessionToken.set(null)
  return {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    subscription: null,
    isNewUser: false,
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      authReady: false,
      subscription: null,
      isNewUser: false,

      login: async (email: string, password: string) => {
        const { accessToken, user } = await authApi.login({ email, password })
        sessionToken.set(accessToken)
        set({ accessToken, ...applyAuthUser(user) })
      },

      register: async (name: string, email: string, password: string) => {
        await authApi.register({ name, email, password })
      },

      setSession: (accessToken, user) => {
        sessionToken.set(accessToken)
        set({ accessToken, ...applyAuthUser(user) })
      },

      bootstrap: async () => {
        const { accessToken, isAuthenticated, user } = get()

        if (accessToken) {
          sessionToken.set(accessToken)
        }

        try {
          if (accessToken) {
            try {
              const { user: freshUser } = await authApi.me()
              set({ ...applyAuthUser(freshUser), authReady: true })
              return
            } catch (err) {
              if (!(err instanceof ApiError && err.status === 401)) {
                throw err
              }
            }
          }

          if (isAuthenticated || user) {
            const { accessToken: newToken } = await authApi.refresh()
            sessionToken.set(newToken)
            const { user: freshUser } = await authApi.me()
            set({
              accessToken: newToken,
              ...applyAuthUser(freshUser),
              authReady: true,
            })
            return
          }

          try {
            const { accessToken: newToken } = await authApi.refresh()
            sessionToken.set(newToken)
            const { user: freshUser } = await authApi.me()
            set({
              accessToken: newToken,
              ...applyAuthUser(freshUser),
              authReady: true,
            })
            return
          } catch {
            set({ authReady: true })
          }
        } catch {
          set({ ...clearAuthState(), authReady: true })
        }
      },

      activateSubscription: (subscription) =>
        set({ subscription, isNewUser: false }),

      clearNewUserFlag: () => set({ isNewUser: false }),

      logout: async () => {
        try {
          await authApi.logout()
        } catch {
          // Clear local session even if API call fails
        }
        set(clearAuthState())
      },
    }),
    {
      name: 'jobpilot-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        subscription: state.subscription,
        isNewUser: state.isNewUser,
      }),
    },
  ),
)

registerSessionHandlers({
  onRefreshed: (token) => {
    useAuthStore.setState({ accessToken: token })
  },
  onExpired: () => {
    useAuthStore.setState(clearAuthState())
  },
})

export function getAccessToken(): string | null {
  return sessionToken.get()
}

export function isAuthError(err: unknown, code?: string): err is ApiError {
  return err instanceof ApiError && (code ? err.code === code : true)
}
