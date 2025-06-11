'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Share, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: {
    id: string
    content: string
    imageUrl?: string | null
    hashtags?: string[] | null
    mentions?: string[] | null
    createdAt: Date
    updatedAt: Date
  }
  author: {
    id: string
    email: string
    username?: string | null
    name?: string | null
    avatar?: string | null
    bio?: string | null
  }
  currentUserId: string
}

export default function PostCard({ post, author, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiking, setIsLiking] = useState(false)
  const router = useRouter()

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    try {
      const response = await fetch('/api/posts/star', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: post.id }),
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const displayName = author.name || author.username || author.email.split('@')[0]
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Author info */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          {author.avatar ? (
            <img src={author.avatar} alt={displayName} className="w-10 h-10 rounded-full" />
          ) : (
            <User className="h-6 w-6 text-primary" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{displayName}</h3>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
      </div>

      {/* Post content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        
        {post.imageUrl && (
          <div className="mt-3">
            <img
              src={post.imageUrl}
              alt="Post image"
              className="rounded-lg max-w-full h-auto"
            />
          </div>
        )}

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.hashtags.map((hashtag, index) => (
              <span
                key={index}
                className="text-primary hover:text-primary/80 cursor-pointer"
              >
                #{hashtag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount > 0 ? likeCount : ''}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500 hover:text-primary transition-colors">
            <MessageCircle className="h-5 w-5" />
            <span>Comment</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500 hover:text-primary transition-colors">
            <Share className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}