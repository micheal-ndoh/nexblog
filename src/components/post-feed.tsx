"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { formatDate, truncateText } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  tags: Array<{
    tag: {
      name: string;
      color: string;
    };
  }>;
  likes: Array<{
    userId: string;
  }>;
  interestedUsers: Array<{
    userId: string;
  }>;
  imageUrl?: string;
}

export function PostFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data.posts || []);

      // Check save status for each post
      if (session?.user) {
        const savePromises = data.posts.map(async (post: Post) => {
          const saveResponse = await fetch(`/api/posts/${post.id}/save`);
          if (saveResponse.ok) {
            const { saved } = await saveResponse.json();
            return { postId: post.id, saved };
          }
          return { postId: post.id, saved: false };
        });

        const saveResults = await Promise.all(savePromises);
        const savedSet = new Set(
          saveResults
            .filter((result) => result.saved)
            .map((result) => result.postId)
        );
        setSavedPosts(savedSet);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = async (postId: string) => {
    if (!session?.user) return;

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        // Optimistically update the UI
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              const isLiked = post.likes.some(
                (like) => like.userId === session.user.id
              );
              return {
                ...post,
                _count: {
                  ...post._count,
                  likes: isLiked
                    ? post._count.likes - 1
                    : post._count.likes + 1,
                },
                likes: isLiked
                  ? post.likes.filter((like) => like.userId !== session.user.id)
                  : [...post.likes, { userId: session.user.id }],
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSave = async (postId: string) => {
    if (!session?.user) return;

    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: "POST",
      });

      if (response.ok) {
        const { saved } = await response.json();

        // Optimistically update the UI
        setSavedPosts((prev) => {
          const newSet = new Set(prev);
          if (saved) {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });

        // Update post interestedUsers count
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              const isSaved = savedPosts.has(postId);
              return {
                ...post,
                interestedUsers: isSaved
                  ? post.interestedUsers.filter(
                      (user) => user.userId !== session.user.id
                    )
                  : [...post.interestedUsers, { userId: session.user.id }],
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const isLiked =
          session?.user &&
          post.likes.some((like) => like.userId === session.user.id);

        const isSaved = savedPosts.has(post.id);

        return (
          <article
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              {/* Post Header */}
              <div className="flex items-start gap-4 mb-4">
                <Link
                  href={`/users/${post.author.id}`}
                  className="hover:opacity-80 transition-opacity"
                >
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">
                      {post.author.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                  )}
                </Link>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <Link
                      href={`/users/${post.author.id}`}
                      className="font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors"
                    >
                      {post.author.name}
                    </Link>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                {post.imageUrl && (
                  <div className="relative w-full" style={{ minHeight: "300px", maxHeight: "500px" }}>
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="100vw"
                      className="object-contain rounded-2xl mb-4"
                    />
                  </div>
                )}
                <Link href={`/posts/${post.id}`}>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {truncateText(post.content, 200)}
                </p>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.tag.name}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${tag.tag.color}20`,
                        color: tag.tag.color,
                      }}
                    >
                      {tag.tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    isLiked
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-500 dark:text-gray-400 hover:text-red-500"
                  }`}
                >
                  {isLiked ? (
                    <HeartIconSolid className="h-5 w-5" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">
                    {post._count.likes}
                  </span>
                </button>

                <Link
                  href={`/posts/${post.id}#comments`}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {post._count.comments}
                  </span>
                </Link>

                <button
                  onClick={() => handleSave(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    isSaved
                      ? "text-primary hover:text-primary/80"
                      : "text-gray-500 dark:text-gray-400 hover:text-primary"
                  }`}
                >
                  {isSaved ? (
                    <BookmarkIconSolid className="h-5 w-5" />
                  ) : (
                    <BookmarkIcon className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">
                    {isSaved ? "Saved" : "Save"}
                  </span>
                </button>
              </div>
            </div>
          </article>
        );
      })}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Be the first to share an update!
          </p>
        </div>
      )}
    </div>
  );
}
