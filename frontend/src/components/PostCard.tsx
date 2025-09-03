import { useState } from "react"
import { useAuth } from "@/store"
import { api } from "@/lib/api"
import Comments from "./Comments"
export default function PostCard({ post }: { post: any }) {
  const { token, username } = useAuth()
  const [liked,setLiked]=useState(!!post.liked_by_me)
  const [likes,setLikes]=useState(post.likes??0)
  const [editing,setEditing]=useState(false)
  const [text,setText]=useState(post.text)
  async function toggleLike(){ if(!token)return; if(liked){await api.unlike(token,post.id); setLiked(false); setLikes(l=>l-1)} else {await api.like(token,post.id); setLiked(true); setLikes(l=>l+1)} }
  async function saveEdit(){ if(!token||!text.trim())return; await api.updatePost(token,post.id,text.trim()); setEditing(false) }
  async function del(){ if(!token)return; if(!confirm("Delete this post?"))return; await api.deletePost(token,post.id); location.reload() }
  const isMine = username===post.author.username
  return (
    <div className="rounded-xl border p-4 dark:border-zinc-800">
      <div className="mb-2 text-sm text-gray-500">@{post.author.username}</div>
      {editing ? (
        <div className="space-y-2">
          <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full rounded-lg border p-2 dark:bg-zinc-900 dark:border-zinc-800" />
          <div className="flex gap-2">
            <button onClick={saveEdit} className="rounded-lg bg-black text-white px-3 py-1">Save</button>
            <button onClick={()=>{setEditing(false); setText(post.text)}} className="rounded-lg border px-3 py-1">Cancel</button>
          </div>
        </div>
      ) : (<div className="mb-3 whitespace-pre-wrap">{post.text}</div>)}
      <div className="flex items-center gap-4">
        <button onClick={toggleLike} className="text-sm">{liked?"❤️":"🤍"} {likes}</button>
        {isMine && !editing && (<>
          <button onClick={()=>setEditing(true)} className="text-sm">Edit</button>
          <button onClick={del} className="text-sm text-red-600">Delete</button>
        </>)}
      </div>
      <Comments postId={post.id} />
    </div>
  )
}
