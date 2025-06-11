'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LogOut, Home, UserIcon } from 'lucide-react'

interface NavbarProps {
  user?: {
    id: string
    email: string
    name?: string
  } | null
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary">
              Social App
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/feed"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <Home className="h-5 w-5" />
                  <span>Feed</span>
                </Link>
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="h-5 w-5" />
                  <span>{user.name || user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}