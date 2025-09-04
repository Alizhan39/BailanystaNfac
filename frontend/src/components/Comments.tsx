import { useEffect, useState } from 'react'
import { api } from '../lib/api'

type Comment = {
  id: number
  text: string
  created_at: string
  author: { id: number; username: string; created_at: string }
}

export default function Comments({ postId, token }: { postId: number; token?: string }) {
  const [items, setItems] = useState<Comment[]>([])
  const [text, setText] = useState('')

  async function load() {
    const data = await api.getComments(postId)
    setItems(data as Comment[])
  }

  useEffect(() => { load() }, [postId])

  async function add() {
    if (!token) return
    const t = text.trim()
    if (!t) return
    await api.addComment(token, postId, t)
    setText('')
    load()
  }

  async function del(id: number) {
    if (!token) return
    await api.deleteComment(token, postId, id)
    load()
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          value={text}
          placeholder="Написать комментарий..."
          onChange={e => setText(e.target.value)}
        />
        <button className="px-3 py-2 border rounded" onClick={add} disabled={!token}>Отправить</button>
      </div>
      <ul className="space-y-2">
        {items.map(c => (
          <li key={c.id} className="border rounded p-2">
            <div className="text-sm opacity-70">@{c.author.username}</div>
            <div>{c.text}</div>
            {token && (
              <button className="text-xs opacity-70" onClick={() => del(c.id)}>удалить</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
