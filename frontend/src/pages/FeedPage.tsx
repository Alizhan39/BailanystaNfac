import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import PostCard from '@/components/PostCard'

type User = { id: number; username: string; created_at: string }
type Post = { id: number; text: string; created_at: string; author: User; likes?: number }

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const data = await api.getPosts()
      const items = (data as any).items ?? (data as any)
      setPosts(items)
    } catch (e: any) {
      setError(e?.message || 'Не удалось загрузить ленту')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div>Загрузка…</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Лента</h1>
      {posts.length === 0 ? <p className="text-gray-500">Постов пока нет.</p>
        : posts.map(p => <PostCard key={p.id} post={p} />)}
    </div>
  )
}
