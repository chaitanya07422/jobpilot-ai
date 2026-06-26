let accessToken: string | null = null

type SessionHandlers = {
  onRefreshed?: (token: string) => void
  onExpired?: () => void
}

let handlers: SessionHandlers = {}

export const sessionToken = {
  get: (): string | null => accessToken,
  set: (token: string | null): void => {
    accessToken = token
  },
}

export function registerSessionHandlers(next: SessionHandlers): void {
  handlers = next
}

export function notifyTokenRefreshed(token: string): void {
  handlers.onRefreshed?.(token)
}

export function notifySessionExpired(): void {
  handlers.onExpired?.()
}
