const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
async function http(path, opts={}) {
  const res = await fetch(API_URL + path, { headers: { 'Content-Type': 'application/json', ...(opts.headers||{}) }, ...opts })
  if (!res.ok) throw new Error(await res.text()); return res.json()
}
export const api = {
  register: (u) => http('/api/auth/register',{method:'POST',body:JSON.stringify({username:u})}),
  login: (u) => http('/api/auth/login',{method:'POST',body:JSON.stringify({username:u})}),
  me: (t) => http('/api/auth/me',{headers:{Authorization:`Bearer ${t}`}}),
  getPosts: (t,c) => http(`/api/posts${c?`?cursor=${encodeURIComponent(c)}`:''}`, {headers:t?{Authorization:`Bearer ${t}`}:{}}),
  getPost: (id,t) => http(`/api/posts/${id}`, {headers:t?{Authorization:`Bearer ${t}`}:{}}),
  createPost: (t,text) => http('/api/posts',{method:'POST',headers:{Authorization:`Bearer ${t}`},body:JSON.stringify({text})}),
  updatePost: (t,id,text)=> http(`/api/posts/${id}`,{method:'PATCH',headers:{Authorization:`Bearer ${t}`},body:JSON.stringify({text})}),
  deletePost: (t,id)=> http(`/api/posts/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${t}`}}),
  like:   (t,id)=> http(`/api/posts/${id}/like`,{method:'POST',headers:{Authorization:`Bearer ${t}`}}),
  unlike: (t,id)=> http(`/api/posts/${id}/like`,{method:'DELETE',headers:{Authorization:`Bearer ${t}`}}),
  listComments:(id)=> http(`/api/posts/${id}/comments`),
  addComment:(t,id,text)=> http(`/api/posts/${id}/comments`,{method:'POST',headers:{Authorization:`Bearer ${t}`},body:JSON.stringify({text})}),
  deleteComment:(t,id,cid)=> http(`/api/posts/${id}/comments/${cid}`,{method:'DELETE',headers:{Authorization:`Bearer ${t}`}})
}
