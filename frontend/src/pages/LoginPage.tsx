import { useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/store'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { setAuth } = useAuth()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await api.login(name.trim())
      setAuth(res.token, res.user.username)
      nav('/')
    } catch (e: any) {
      setError(e?.message || 'Login failed')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Username" className="rounded-lg border px-3 py-2" />
        <button className="rounded-lg bg-black px-4 py-2 font-medium text-white" disabled={!name.trim()}>
          Login
        </button>
      </form>
      {error && <div className="text-red-600">{error}</div>}
      <p className="text-sm text-gray-500">Если пользователя нет — зарегистрируйтесь на вкладке Profile.</p>
    </div>
  )
}
