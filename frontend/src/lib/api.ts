// frontend/src/lib/api.ts

export const API_URL =
  (import.meta?.env?.VITE_API_URL as string | undefined) ||
  'http://127.0.0.1:8000'

const logoutAndRedirect = () => {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  } catch {}
}

async function http(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, { ...opts })

  if (!res.ok) {
    if (res.status === 401) logoutAndRedirect()
    let msg = `HTTP ${res.status}`
    try {
      const data = await res.json()
      msg = (data as any)?.error || (data as any)?.msg || msg
    } catch {}
    throw new Error(msg)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const api = {
  register(u?: string) {
    return http('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u }),
    })
  },
  login(u?: string) {
    return http('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u }),
    })
  },
  me(t?: string) {
    return http('/api/auth/me', {
      headers: t ? { Authorization: `Bearer ${t}` } : {},
    })
  },

  getPosts(t?: string, cursor?: string) {
    const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
    return http(`/api/posts${qs}`, {
      headers: t ? { Authorization: `Bearer ${t}` } : {},
    })
  },
  getPost(id: number, t?: string) {
    return http(`/api/posts/${id}`, {
      headers: t ? { Authorization: `Bearer ${t}` } : {},
    })
  },
  createPost(t?: string, text?: string) {
    return http('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
      body: JSON.stringify({ text }),
    })
  },
  updatePost(t?: string, id?: number, text?: string) {
    return http(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
      body: JSON.stringify({ text }),
    })
  },
  deletePost(t?: string, id?: number) {
    return http(`/api/posts/${id}`, {
      method: 'DELETE',
      headers: t ? { Authorization: `Bearer ${t}` } : {},
    })
  },

  like(t?: string, id?: number) {
    return http(`/api/posts/${id}/like`, {
      method: 'POST',
      headers: t ? { Authorization: `Bearer ${t}` } : {},
    })
  },
  unlike(t?: string, id?: number) {
    return http(`/api/posts/${id}/like`, {
      method: 'DELETE',
      headers: t ? { Authorization: `Bearer ${t}` } : {},
    })
  },

  listComments(id: number) {
    return http(`/api/posts/${id}/comments`)
  },
  addComment(t?: string, id?: number, text?: string) {
    return http(`/api/posts/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
      body: JSON.stringify({ text }),
    })
  },
}
