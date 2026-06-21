import { delay } from '@/lib/utils'

const DEFAULT_DELAY = 400

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function mockFetch<T>(
  data: T,
  options?: { delay?: number; shouldFail?: boolean },
): Promise<T> {
  await delay(options?.delay ?? DEFAULT_DELAY)
  if (options?.shouldFail) {
    throw new ApiError('Something went wrong. Please try again.', 500)
  }
  return data
}
