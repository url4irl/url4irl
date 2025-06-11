import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getFeed } from '@url4irl/posts'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import CreatePost from '@/components/CreatePost'
import '@/lib/db' // Initialize database connection

export default async function FeedPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get feed posts
  const feedData = await getFeed({ limit: 20, offset: 0 })

  return (
    <div>
      <Navbar user={user} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <CreatePost userId={user.userId} />
        </div>

        <div className="space-y-6">
          {feedData.data && feedData.data.length > 0 ? (
            feedData.data.map((item) => (
              <PostCard
                key={item.post.id}
                post={item.post}
                author={item.author}
                currentUserId={user.userId}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No posts yet. Create your first post above!
              </p>
            </div>
          )}
        </div>

        {feedData.data && feedData.data.length >= 20 && (
          <div className="mt-8 text-center">
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90">
              Load More
            </button>
          </div>
        )}
      </main>
    </div>
  )
}