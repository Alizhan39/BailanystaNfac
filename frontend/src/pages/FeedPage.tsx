import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import PostCard from '@/components/PostCard'
import { useAuth } from '@/store'

type User = { id: number; username: string; created_at: string }
type Post = { id: number; text: string; created_at: string; author: User; likes?: number; liked_by_me?: boolean }
type FeedResp = { items: Post[]; next_cursor: string | null }

export default function FeedPage() {
  const token =
  typeof localStorage !== 'undefined'
    ? (localStorage.getItem('token') ?? undefined)
    : undefined

const data = await api.getPosts(token)
// ...
await api.likePost(post.id, token)
// ...
await api.unlikePost(post.id, token)
  const [posts, setPosts] = useState<Post[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  async function loadFirst() {
    setLoading(true); setError(null)
    try {
      const data = (await api.getPosts(token, null)) as FeedResp
      setPosts(data.items)
      setCursor(data.next_cursor)
      setHasMore(!!data.next_cursor)
    } catch (e: any) {
      setError(e?.message || 'Не удалось загрузить ленту')
    } finally {
      setLoading(false)
    }
  }

  async function loadMore() {
    if (!hasMore || loadingMore) return
    setLoadingMore(true)
    try {
      const data = (await api.getPosts(token, cursor)) as FeedResp
      // дедуп по id на случай повторов
      const existing = new Set(posts.map(p => p.id))
      const merged = [...posts, ...data.items.filter(p => !existing.has(p.id))]
      setPosts(merged)
      setCursor(data.next_cursor)
      setHasMore(!!data.next_cursor)
    } catch (e: any) {
      console.error(e)
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => { loadFirst() }, [token])

  // IntersectionObserver для автоподгрузки
  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        loadMore()
      }
    }, { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderRef.current, cursor, hasMore, loadingMore, posts.length])

  if (loading) return <div>Загрузка…</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Лента</h1>

      {posts.length === 0 && <p className="text-gray-500">Постов пока нет.</p>}
      {posts.map(p => <PostCard key={p.id} post={p} />)}

      {hasMore ? (
        <div className="flex items-center justify-center py-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {loadingMore ? 'Загрузка…' : 'Загрузить ещё'}
          </button>
        </div>
      ) : (
        <div className="py-4 text-center text-sm text-gray-500">Больше постов нет</div>
      )}

      {/* наблюдатель для автоподгрузки */}
      <div ref={loaderRef} style={{ height: 1 }} />
    </div>
  )
}
