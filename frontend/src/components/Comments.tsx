import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/store'
export default function Comments({ postId }:{postId:number}) {
  const { token, username } = useAuth()
  const [items,setItems]=useState<any[]>([])
  const [text,setText]=useState('')
  async function load(){ setItems(await api.listComments(postId) as any) }
  useEffect(()=>{ load() },[postId])
  async function submit(e:React.FormEvent){ e.preventDefault(); if(!token||!text.trim())return; await api.addComment(token,postId,text.trim()); setText(''); load() }
  async function del(id:number){ if(!token) return; await api.deleteComment(token,postId,id); load() }
  return (
    <div className="mt-3 space-y-2">
      {items.map(c=>(
        <div key={c.id} className="rounded-lg border p-2 text-sm dark:border-zinc-800">
          <div className="font-medium">@{c.author.username}</div>
          <div>{c.text}</div>
          {username===c.author.username && <button onClick={()=>del(c.id)} className="text-red-600 text-xs mt-1">Delete</button>}
        </div>
      ))}
      <form onSubmit={submit} className="flex items-center gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Add comment"
               className="flex-1 rounded-lg border px-3 py-2 dark:bg-zinc-900 dark:border-zinc-800" />
        <button className="rounded-lg bg-black text-white px-3 py-2 disabled:opacity-50" disabled={!token||!text.trim()}>Send</button>
      </form>
    </div>
  )
}
