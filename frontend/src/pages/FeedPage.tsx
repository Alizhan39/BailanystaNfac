import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import PostCard, { Post } from '../components/PostCard'

type FeedResp = { items: Post[]; next_cursor: string | null }

export default function FeedPage() {
  const token = (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null) || undefined
  const [posts, setPosts] = useState<Post[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const data = (await api.getPosts(token)) as FeedResp
        setPosts(data.items)
        setCursor(data.next_cursor)
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  async function loadMore() {
    if (loading) return
    setLoading(true)
    try {
      const data = (await api.getPosts(token, cursor ?? undefined)) as FeedResp
      setPosts(prev => [...prev, ...data.items])
      setCursor(data.next_cursor)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Лента</h1>
      {posts.map(p => <PostCard key={p.id} post={p} />)}
      {cursor ? (
        <button className="px-3 py-2 border rounded" onClick={loadMore} disabled={loading}>
          {loading ? 'Загрузка...' : 'Ещё'}
        </button>
      ) : (
        <div className="opacity-60 text-center">Больше постов нет</div>
      )}
    </div>
  )
}
