const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'


async function http<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}


export const api = {
  health: () => http<{ status: string }>(`/api/health`),
  register: (username: string) => http<{ token: string; user: any }>(`/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ username }),
  }),
  me: (token: string) => http(`/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
  getPosts: () => http(`/api/posts`),
  createPost: (token: string, text: string) =>
    http(`/api/posts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text }),
    }),
}
