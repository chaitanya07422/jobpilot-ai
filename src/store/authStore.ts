import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Subscription } from '@/types/subscription.types'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  subscription: Subscription | null
  isNewUser: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  activateSubscription: (subscription: Subscription) => void
  clearNewUserFlag: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      subscription: null,
      isNewUser: false,

      login: async (email: string, _password: string) => {
        await new Promise((r) => setTimeout(r, 600))
        const user: User = {
          id: `user-${email}`,
          name: email.split('@')[0] ?? 'User',
          email,
        }
        set({ user, isAuthenticated: true, isNewUser: false })
        return true
      },

      register: async (name: string, email: string, _password: string) => {
        await new Promise((r) => setTimeout(r, 600))
        const user: User = { id: `user-${email}`, name, email }
        set({
          user,
          isAuthenticated: true,
          subscription: null,
          isNewUser: true,
        })
        return true
      },

      activateSubscription: (subscription) =>
        set({ subscription, isNewUser: false }),

      clearNewUserFlag: () => set({ isNewUser: false }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          subscription: null,
          isNewUser: false,
        }),
    }),
    { name: 'jobpilot-auth' },
  ),
)
