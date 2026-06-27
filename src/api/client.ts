import { delay } from '@/lib/utils'
import {
  notifySessionExpired,
  notifyTokenRefreshed,
  sessionToken,
} from '@/lib/session-token'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  status: number
  code: string

  constructor(message: string, status: number, code = 'API_ERROR') {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface ApiEnvelope<T> {
  success: boolean
  data?: T
  message?: string
  error?: { code: string; message: string }
}

export type ApiFetchOptions = RequestInit & {
  accessToken?: string
  skipAuthRetry?: boolean
}

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        })

        const body = (await res.json()) as ApiEnvelope<{ accessToken: string }>

        if (!res.ok || !body.success || !body.data?.accessToken) {
          notifySessionExpired()
          return null
        }

        const token = body.data.accessToken
        sessionToken.set(token)
        notifyTokenRefreshed(token)
        return token
      } catch {
        notifySessionExpired()
        return null
      } finally {
        refreshPromise = null
      }
    })()
  }

  return refreshPromise
}

async function parseResponse<T>(res: Response): Promise<ApiEnvelope<T>> {
  return (await res.json()) as ApiEnvelope<T>
}

export async function apiFetch<T>(
  path: string,
  options?: ApiFetchOptions,
): Promise<T> {
  const token = options?.accessToken ?? sessionToken.get()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const { accessToken: _, skipAuthRetry, ...fetchOptions } = options ?? {}

  const res = await fetch(`${API_URL}/api/v1${path}`, {
    credentials: 'include',
    ...fetchOptions,
    headers,
  })

  if (res.status === 401 && !skipAuthRetry) {
    const newToken = await refreshAccessToken()

    if (newToken) {
      return apiFetch<T>(path, {
        ...options,
        accessToken: newToken,
        skipAuthRetry: true,
      })
    }
  }

  const body = await parseResponse<T>(res)

  if (!res.ok || !body.success) {
    throw new ApiError(
      body.error?.message ?? 'Request failed',
      res.status,
      body.error?.code,
    )
  }

  return body.data as T
}

export async function apiUpload<T>(
  path: string,
  file: File,
  fieldName = 'file',
): Promise<T> {
  const token = sessionToken.get()
  const formData = new FormData()
  formData.append(fieldName, file)

  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}/api/v1${path}`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: formData,
  })

  if (res.status === 401) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      const retryForm = new FormData()
      retryForm.append(fieldName, file)
      const retryRes = await fetch(`${API_URL}/api/v1${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${newToken}` },
        body: retryForm,
      })
      const retryBody = await parseResponse<T>(retryRes)
      if (!retryRes.ok || !retryBody.success) {
        throw new ApiError(
          retryBody.error?.message ?? 'Upload failed',
          retryRes.status,
          retryBody.error?.code,
        )
      }
      return retryBody.data as T
    }
  }

  const body = await parseResponse<T>(res)

  if (!res.ok || !body.success) {
    throw new ApiError(
      body.error?.message ?? 'Upload failed',
      res.status,
      body.error?.code,
    )
  }

  return body.data as T
}

/** @deprecated Use apiFetch for real API calls */
export async function mockFetch<T>(
  data: T,
  options?: { delay?: number; shouldFail?: boolean },
): Promise<T> {
  await delay(options?.delay ?? 400)
  if (options?.shouldFail) {
    throw new ApiError('Something went wrong. Please try again.', 500)
  }
  return data
}
