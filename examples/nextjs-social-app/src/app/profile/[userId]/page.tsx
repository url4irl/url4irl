import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import { User } from 'lucide-react'

interface ProfilePageProps {
  params: {
    userId: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  const isOwnProfile = user.userId === params.userId

  return (
    <div>
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isOwnProfile ? 'Your Profile' : 'User Profile'}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                User ID: {params.userId}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">About</h2>
            <p className="text-gray-600">
              {isOwnProfile
                ? "This is your profile page. In a full implementation, you could edit your bio, upload an avatar, and manage your profile settings here."
                : "This user hasn't added a bio yet."
              }
            </p>
          </div>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Posts</h2>
            <p className="text-gray-500">
              Posts will be displayed here when the getUserPosts functionality is integrated.
            </p>
          </div>

          {isOwnProfile && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <p className="text-gray-500">
                Profile settings and customization options would be available here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}