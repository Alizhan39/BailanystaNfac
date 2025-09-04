export type ApiUser = { id: number; username: string; created_at: string }
export type ApiPost = {
  id: number; text: string; created_at: string; author: ApiUser
  likes?: number; liked_by_me?: boolean; comments_count?: number
}
export type ApiComment = { id: number; text: string; created_at: string; author: ApiUser }

const BASE: string =
  // @ts-ignore
  (import.meta as any)?.env?.VITE_API_URL ??
  import.meta.env?.VITE_API_URL ??
  'http://127.0.0.1:8000'

const apiUrl = (path: string) => `${BASE.replace(/\/$/, '')}${path}`

async function http<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), init)
  if (!res.ok) {
    let msg: any
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      try { msg = await res.json() } catch { msg = null }
    } else {
      msg = await res.text()
    }
    throw new Error(
      (typeof msg === 'string' && msg) ||
      msg?.msg || msg?.error || res.statusText || `HTTP ${res.status}`
    )
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return (await res.json()) as T
  return (await res.text()) as unknown as T
}

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {}
}
const hdr = (extra: Record<string,string> = {}, token?: string): HeadersInit =>
  ({ ...extra, ...authHeaders(token) })

export const api = {
  async register(username?: string) {
    return http('/api/auth/register', {
      method: 'POST',
      headers: hdr({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ username }),
    })
  },
  async login(username?: string) {
    return http('/api/auth/login', {
      method: 'POST',
      headers: hdr({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ username }),
    })
  },
  async me(token?: string) {
    return http('/api/auth/me', { headers: hdr({}, token) })
  },
  async getPosts(token?: string, cursor?: string) {
    const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
    return http(`/api/posts${qs}`, { headers: hdr({}, token) })
  },
  async createPost(token: string, text: string) {
    return http('/api/posts', {
      method: 'POST',
      headers: hdr({ 'Content-Type': 'application/json' }, token),
      body: JSON.stringify({ text }),
    })
  },
  async updatePost(token: string, id: number, text: string) {
    return http(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: hdr({ 'Content-Type': 'application/json' }, token),
      body: JSON.stringify({ text }),
    })
  },
  async deletePost(token: string, id: number) {
    return http(`/api/posts/${id}`, {
      method: 'DELETE',
      headers: hdr({}, token),
    })
  },
  async like(token: string, id: number) {
    return http(`/api/posts/${id}/like`, {
      method: 'POST',
      headers: hdr({}, token),
    })
  },
  async unlike(token: string, id: number) {
    return http(`/api/posts/${id}/unlike`, {
      method: 'POST',
      headers: hdr({}, token),
    })
  },
  async addComment(token: string, id: number, text: string) {
    return http(`/api/posts/${id}/comments`, {
      method: 'POST',
      headers: hdr({ 'Content-Type': 'application/json' }, token),
      body: JSON.stringify({ text }),
    })
  },
  async getComments(id: number) {
    return http<ApiComment[]>(`/api/posts/${id}/comments`)
  },
  async deleteComment(token: string, postId: number, commentId: number) {
    return http(`/api/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: hdr({}, token),
    })
  },
}
