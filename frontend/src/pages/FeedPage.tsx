import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import PostCard from '@/components/PostCard'
import type { Post } from '@/lib/types'


export default function FeedPage() {
const [posts, setPosts] = useState<Post[]>([])
async function load() {
const data = await api.getPosts()
setPosts(data as any)
}
useEffect(() => { load() }, [])
return (
<div className="space-y-4">
<h1 className="text-2xl font-bold">Feed</h1>
{posts.length === 0 ? (
<p className="text-gray-500">No posts yet. Be the first!</p>
) : (
posts.map(p => <PostCard key={p.id} post={p} />)
)}
</div>
)
}
