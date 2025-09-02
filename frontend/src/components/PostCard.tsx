import { useState } from 'react'
import type { Post } from '@/lib/types'
import { useAuth } from '@/store'
import { api } from '@/lib/api'

export default function PostCard({ post }: { post: Post }) {
  const { token } = useAuth()
  const [likes, setLikes] = useState<number>(post.likes ?? 0)
  const [liked, setLiked] = useState<boolean>(false) // у нас нет флага из бэка — делаем оптимистично
  const [busy, setBusy] = useState(false)

  async function toggleLike() {
    if (!token) return alert('Сначала зарегистрируйтесь на вкладке Profile.')
    setBusy(true)
    try {
      if (liked) {
        await api.unlike(token, post.id)
        setLiked(false)
        setLikes((n) => Math.max(0, n - 1))
      } else {
        await api.like(token, post.id)
        setLiked(true)
        setLikes((n) => n + 1)
      }
    } catch (e: any) {
      alert(e.message || 'Ошибка лайка')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-1 text-sm text-gray-500">
        <span className="font-medium">@{post.author.username}</span>
        <span className="mx-2">•</span>
        <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleString()}</time>
      </div>
      <p className="whitespace-pre-wrap leading-relaxed">{post.text}</p>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={toggleLike}
          disabled={busy}
          className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
          aria-pressed={liked}
        >
          {liked ? '♥' : '♡'} {likes}
        </button>
      </div>
    </article>
  )
}
