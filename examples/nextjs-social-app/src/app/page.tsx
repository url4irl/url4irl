import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await getCurrentUser()

  // If user is logged in, redirect to feed
  if (user) {
    redirect('/feed')
  }

  return (
    <div>
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to Social App
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A social networking platform built with the url4irl package ecosystem. 
            Connect with friends, share posts, and build meaningful relationships 
            in a decentralized social environment.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-md text-lg font-medium hover:bg-primary/90 inline-block"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto bg-white text-gray-900 px-8 py-3 rounded-md text-lg font-medium border border-gray-300 hover:bg-gray-50 inline-block"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Share Posts</h3>
              <p className="text-gray-600">
                Create and share posts with your network. Express yourself with text and images.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Follow friends and discover new people. Build meaningful connections.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Engage</h3>
              <p className="text-gray-600">
                Like, comment, and engage with posts from your network.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Built with url4irl</h2>
            <p className="text-gray-600 mb-6">
              This application demonstrates the power of the url4irl package ecosystem 
              for building social networking applications with PostgreSQL.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['@url4irl/auth', '@url4irl/posts', '@url4irl/users', '@url4irl/db', '@url4irl/comments', '@url4irl/follow', '@url4irl/stars'].map((pkg) => (
                <span
                  key={pkg}
                  className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border"
                >
                  {pkg}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}