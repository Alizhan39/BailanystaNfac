import { useState } from 'react'
import { api } from '../lib/api'
import Comments from './Comments'

type Author = { id: number; username: string; created_at: string }
export type Post = {
  id: number
  text: string
  likes: number
  liked_by_me: boolean
  comments_count?: number
  created_at: string
  author: Author
}

export default function PostCard({ post }: { post: Post }) {
  const token = (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null) || undefined
  const [likes, setLikes] = useState<number>(post.likes)
  const [liked, setLiked] = useState<boolean>(post.liked_by_me)

  async function toggleLike() {
    if (!token) return
    if (liked) {
      await api.unlike(token, post.id)
      setLiked(false)
      setLikes((l: number) => l - 1)
    } else {
      await api.like(token, post.id)
      setLiked(true)
      setLikes((l: number) => l + 1)
    }
  }

  return (
    <div className="border rounded-2xl p-4 space-y-3">
      <div className="text-sm opacity-70">@{post.author.username}</div>
      <div>{post.text}</div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-1 border rounded" onClick={toggleLike} disabled={!token}>
          {liked ? '♥ Liked' : '♡ Like'}
        </button>
        <span className="text-sm">{likes}</span>
      </div>
      <Comments postId={post.id} token={token} />
    </div>
  )
}
