"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { PostFeed } from "@/components/post-feed"
import { PostFeedSkeleton } from "@/components/post-feed-skeleton"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      fetchSearchResults()
    }
  }, [query])

  const fetchSearchResults = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts?search=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching search results:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600 dark:text-gray-400">
              Showing results for "{query}"
            </p>
          )}
        </div>

        {loading ? (
          <PostFeedSkeleton />
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post: any) => (
              <article key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={post.author.image || '/default-avatar.png'}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {post.author.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {post.content.length > 200 
                        ? `${post.content.substring(0, 200)}...` 
                        : post.content
                      }
                    </p>
                  </div>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag: any) => (
                        <span
                          key={tag.tag.name}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${tag.tag.color}20`,
                            color: tag.tag.color 
                          }}
                        >
                          {tag.tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z" />
                      </svg>
                      <span className="text-sm font-medium">{post._count.likes}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z" />
                      </svg>
                      <span className="text-sm font-medium">{post._count.comments}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try searching with different keywords or tags.
            </p>
          </div>
        )}
      </main>
    </div>
  )
} 