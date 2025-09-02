import type { Post } from '@/lib/types'


export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-1 text-sm text-gray-500">
        <span className="font-medium">@{post.author.username}</span>
        <span className="mx-2">•</span>
        <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleString()}</time>
     </div>
     <p className="whitespace-pre-wrap leading-relaxed">{post.text}</p>
   </article>
 )
}
