import { apiFetch } from '@/api/client'

export interface AuthUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  isNewUser: boolean
  subscription: {
    planId?: string
    active: boolean
    activatedAt?: string
    expiresAt?: string
  }
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiFetch<{ user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<{ accessToken: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyEmail: (token: string) =>
    apiFetch<null>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiFetch<null>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  forgotPassword: (email: string) =>
    apiFetch<null>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    apiFetch<null>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  logout: () =>
    apiFetch<null>('/auth/logout', {
      method: 'POST',
    }),

  me: (accessToken: string) =>
    apiFetch<{ user: AuthUser }>('/auth/me', {
      accessToken,
    }),
}
