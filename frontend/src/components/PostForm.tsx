import { useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'


export default function PostForm({ onCreated }: { onCreated: () => void }) {
const [text, setText] = useState('')
const [loading, setLoading] = useState(false)
const { token } = useAuth()


async function submit(e: React.FormEvent) {
e.preventDefault()
if (!token) return alert('Please register/login first (username only).')
setLoading(true)
try {
await api.createPost(token, text)
setText('')
onCreated()
} catch (e: any) {
alert(e.message || 'Failed to post')
} finally {
setLoading(false)
}
}


return (
<form onSubmit={submit} className="rounded-2xl border bg-white p-4 shadow-sm">
<textarea
value={text}
onChange={(e) => setText(e.target.value)}
placeholder="What's happening?"
className="w-full resize-none rounded-lg border p-3 outline-none"
rows={3}
maxLength={1000}
/>
<div className="mt-2 flex items-center justify-between text-sm text-gray-500">
<span>{text.length}/1000</span>
<button disabled={loading || !text.trim()} className="rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-50">
{loading ? 'Posting…' : 'Post'}
</button>
</div>
</form>
)
}
