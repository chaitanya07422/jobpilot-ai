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
      skipAuthRetry: true,
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<{ accessToken: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuthRetry: true,
    }),

  refresh: () =>
    apiFetch<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      skipAuthRetry: true,
    }),

  verifyEmail: (token: string) =>
    apiFetch<null>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
      skipAuthRetry: true,
    }),

  resendVerification: (email: string) =>
    apiFetch<null>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuthRetry: true,
    }),

  forgotPassword: (email: string) =>
    apiFetch<null>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuthRetry: true,
    }),

  resetPassword: (token: string, password: string) =>
    apiFetch<null>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
      skipAuthRetry: true,
    }),

  logout: () =>
    apiFetch<null>('/auth/logout', {
      method: 'POST',
      skipAuthRetry: true,
    }),

  me: () => apiFetch<{ user: AuthUser }>('/auth/me'),
}
