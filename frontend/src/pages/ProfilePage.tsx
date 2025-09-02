import { useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'
import PostForm from '@/components/PostForm'


export default function ProfilePage() {
  const { token, username, setAuth } = useAuth()
  const [name, setName] = useState('')


  async function register(e: React.FormEvent) {
    e.preventDefault()
    const res = await api.register(name)
    setAuth(res.token, res.user.username)
  }


  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      {!token ? (
        <form onSubmit={register} className="flex items-center gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pick a username"
                 className="rounded-lg border px-3 py-2" />
          <button className="rounded-lg bg-black px-4 py-2 font-medium text-white" disabled={!name.trim()}>Register</button>
        </form>
      ) : (
        <p className="text-gray-600">Logged in as <span className="font-medium">@{username}</span></p>
      )}
      <PostForm onCreated={() => { /* rely on user returning to feed to see new post */ }} />
    </div>
  )
}
