import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi, type AuthUser } from '@/api/auth.api'
import { ApiError } from '@/api/client'
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
  subscription: Subscription | null
  isNewUser: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  setSession: (accessToken: string, user: AuthUser) => void
  activateSubscription: (subscription: Subscription) => void
  clearNewUserFlag: () => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      subscription: null,
      isNewUser: false,

      login: async (email: string, password: string) => {
        const { accessToken, user } = await authApi.login({ email, password })
        set({
          accessToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
          },
          isAuthenticated: true,
          isNewUser: user.isNewUser,
          subscription: user.subscription?.active
            ? {
                planId: user.subscription.planId as Subscription['planId'],
                active: true,
                activatedAt: user.subscription.activatedAt ?? '',
                expiresAt: user.subscription.expiresAt ?? '',
              }
            : null,
        })
      },

      register: async (name: string, email: string, password: string) => {
        await authApi.register({ name, email, password })
      },

      setSession: (accessToken, user) =>
        set({
          accessToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
          },
          isAuthenticated: true,
          isNewUser: user.isNewUser,
          subscription: user.subscription?.active
            ? {
                planId: user.subscription.planId as Subscription['planId'],
                active: true,
                activatedAt: user.subscription.activatedAt ?? '',
                expiresAt: user.subscription.expiresAt ?? '',
              }
            : null,
        }),

      activateSubscription: (subscription) =>
        set({ subscription, isNewUser: false }),

      clearNewUserFlag: () => set({ isNewUser: false }),

      logout: async () => {
        try {
          await authApi.logout()
        } catch {
          // Clear local session even if API call fails
        }
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          subscription: null,
          isNewUser: false,
        })
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

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken
}

export function isAuthError(err: unknown, code?: string): err is ApiError {
  return err instanceof ApiError && (code ? err.code === code : true)
}
