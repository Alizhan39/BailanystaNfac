// src/lib/api.ts
export const API_URL =
  (import.meta?.env?.VITE_API_URL as string | undefined) ||
  'http://127.0.0.1:8000'

export const api = {
  async getPosts(token?: string) {
    const r = await fetch(`${API_URL}/api/posts`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  },
  // … остальные методы аналогично принимают token?: string
}
