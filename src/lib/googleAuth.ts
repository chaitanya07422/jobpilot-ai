const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export function startGoogleSignIn(): void {
  window.location.href = `${API_URL}/api/v1/auth/google`
}
