import User from './User'
import Loading from './loading'
import { Suspense } from 'react'
interface Post {
  id: string
  title: string
  content: string
}

export const revalidate = 3600 // invalidate every hour
export const dynamic = "auto"

export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts: Post[] = await data.json()
  return (
    <main>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <Suspense fallback={<Loading />}>
        <User />
      </Suspense>
    </main>
  )
}