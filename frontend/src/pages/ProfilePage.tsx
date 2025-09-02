import { useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/store'
import PostForm from '@/components/PostForm'

export default function ProfilePage() {
  const { token, username, setAuth } = useAuth()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  async function register(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setOk(null)
    try {
      const res: any = await api.register(name)
      setAuth(res.token, res.user.username)
      setOk('Готово! Вы вошли.')
    } catch (e: any) {
      setError(e?.message || 'Не удалось зарегистрироваться')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Профиль</h1>
      {!token ? (
        <form onSubmit={register} className="flex items-center gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Username" className="rounded-lg border px-3 py-2" />
          <button className="rounded-lg bg-black px-4 py-2 font-medium text-white" disabled={!name.trim()}>
            Зарегистрироваться
          </button>
        </form>
      ) : (
        <p className="text-gray-600">Вы вошли как <span className="font-medium">@{username}</span></p>
      )}
      {error && <div className="text-red-600">{error}</div>}
      {ok && <div className="text-green-600">{ok}</div>}

      <PostForm onCreated={() => { /* тут можно дернуть обновление ленты */ }} />
    </div>
  )
}
