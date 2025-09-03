const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
function logoutAndRedirect() {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  } catch {}
  window.location.href = '/login'
}

async function http(path: string, opts: RequestInit = {}) {
  const res = await fetch(API_URL + path, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  })
  const text = await res.text()
  let data: any = null
  try { data = text ? JSON.parse(text) : null } catch { data = { raw: text } }

  if (!res.ok) {
    const msg = (data && (data.msg || data.error)) || text || res.statusText
    if (res.status === 401 && typeof msg === 'string' && msg.toLowerCase().includes('expired')) {
      logoutAndRedirect()
    }
    throw new Error(msg)
  }
  return data
}

export const api = {
  register: (u: string) => http('/api/auth/register',{method:'POST',body:JSON.stringify({username:u})}),
  login: (u: string)    => http('/api/auth/login',{method:'POST',body:JSON.stringify({username:u})}),
  me: (t: string)       => http('/api/auth/me',{headers:{Authorization:`Bearer ${t}`}}),

  getPosts: (t?: string, cursor?: string) =>
    http(`/api/posts${cursor?`?cursor=${encodeURIComponent(cursor)}`:''}`, {headers:t?{Authorization:`Bearer ${t}`}:{}}),

  getPost: (id: number, t?: string) =>
    http(`/api/posts/${id}`, {headers:t?{Authorization:`Bearer ${t}`}:{}}),

  createPost: (t: string, text: string) =>
    http('/api/posts',{method:'POST',headers:{Authorization:`Bearer ${t}`},body:JSON.stringify({text})}),

  updatePost: (t: string, id: number, text: string) =>
    http(`/api/posts/${id}`,{method:'PATCH',headers:{Authorization:`Bearer ${t}`},body:JSON.stringify({text})}),

  deletePost: (t: string, id: number) =>
    http(`/api/posts/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${t}`}}),

  like:   (t: string, id: number) => http(`/api/posts/${id}/like`,{method:'POST',headers:{Authorization:`Bearer ${t}`}}),
  unlike: (t: string, id: number) => http(`/api/posts/${id}/like`,{method:'DELETE',headers:{Authorization:`Bearer ${t}`}}),

  listComments: (id: number) =>
    http(`/api/posts/${id}/comments`),

  addComment: (t: string, id: number, text: string) =>
    http(`/api/posts/${id}/comments`,{method:'POST',headers:{Authorization:`Bearer ${t}`},body:JSON.stringify({text})}),

  deleteComment: (t: string, id: number, cid: number) =>
    http(`/api/posts/${id}/comments/${cid}`,{method:'DELETE',headers:{Authorization:`Bearer ${t}`}}),
}
