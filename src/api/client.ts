import { delay } from '@/lib/utils'

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

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { accessToken?: string },
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  }

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`
  }

  const { accessToken: _, ...fetchOptions } = options ?? {}

  const res = await fetch(`${API_URL}/api/v1${path}`, {
    credentials: 'include',
    ...fetchOptions,
    headers,
  })

  const body = (await res.json()) as ApiEnvelope<T>

  if (!res.ok || !body.success) {
    throw new ApiError(
      body.error?.message ?? 'Request failed',
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
