"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  EyeIcon,
  ShareIcon,
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

// Tag color mapping for varied colors
const tagColors = [
  "tag-blue",
  "tag-green",
  "tag-purple",
  "tag-orange",
  "tag-red",
  "tag-pink",
  "tag-indigo",
  "tag-teal",
];

export function PostFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [loadingMore, setLoadingMore] = useState(false);

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
              const newLikes = isLiked
                ? post.likes.filter((like) => like.userId !== session.user.id)
                : [...post.likes, { userId: session.user.id }];

              return {
                ...post,
                likes: newLikes,
                _count: {
                  ...post._count,
                  likes: isLiked
                    ? post._count.likes - 1
                    : post._count.likes + 1,
                },
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
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
        setSavedPosts((prev) => {
          const newSet = new Set(prev);
          if (saved) {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const loadMorePosts = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisiblePosts((prev) => Math.min(prev + 5, posts.length));
      setLoadingMore(false);
    }, 500);
  };

  const getTagColor = (index: number) => {
    return tagColors[index % tagColors.length];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="post-container p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.slice(0, visiblePosts).map((post) => {
        const isLiked = post.likes.some(
          (like) => like.userId === session?.user?.id
        );
        const isSaved = savedPosts.has(post.id);

        return (
          <article
            key={post.id}
            className="post-container p-6 animate-fade-in-up"
          >
            {/* Author Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                {post.author.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-gray-700"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {post.author.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg">
                  {post.author.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {formatDate(post.createdAt)}
                </p>
              </div>
              <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors rounded-lg hover:bg-gray-800/50">
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <h2 className="text-white text-xl font-bold mb-3 hover:text-orange-400 transition-colors">
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </h2>
              <p className="text-gray-300 text-base leading-relaxed mb-4">
                {truncateText(post.content, 200)}
              </p>

              {/* Post Image */}
              {post.imageUrl && (
                <div className="mb-4">
                  <div className="relative w-full h-64 rounded-xl overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={tag.tag.name}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getTagColor(
                      index
                    )} shadow-lg`}
                  >
                    {tag.tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    isLiked
                      ? "text-red-500 hover:text-red-400"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  {isLiked ? (
                    <HeartIconSolid className="h-6 w-6" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                  <span className="text-sm font-medium text-white">
                    {post._count.likes}
                  </span>
                </button>

                <Link
                  href={`/posts/${post.id}#comments`}
                  className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <ChatBubbleLeftIcon className="h-6 w-6" />
                  <span className="text-sm font-medium text-white">
                    {post._count.comments}
                  </span>
                </Link>

                <button
                  onClick={() => handleSave(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    isSaved
                      ? "text-orange-500 hover:text-orange-400"
                      : "text-gray-400 hover:text-orange-500"
                  }`}
                >
                  {isSaved ? (
                    <BookmarkIconSolid className="h-6 w-6" />
                  ) : (
                    <BookmarkIcon className="h-6 w-6" />
                  )}
                  <span className="text-sm font-medium text-white">
                    {isSaved ? "Saved" : "Save"}
                  </span>
                </button>
              </div>

              <Link
                href={`/posts/${post.id}`}
                className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <EyeIcon className="h-5 w-5" />
                <span className="text-sm font-medium text-white">View</span>
              </Link>
            </div>
          </article>
        );
      })}

      {/* Load More Button */}
      {visiblePosts < posts.length && (
        <div className="text-center pt-6">
          <button
            onClick={loadMorePosts}
            disabled={loadingMore}
            className="btn-primary px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105"
          >
            {loadingMore ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              "Load More Posts"
            )}
          </button>
        </div>
      )}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-16 w-16"
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
          <h3 className="text-xl font-semibold text-white mb-2">
            No posts yet
          </h3>
          <p className="text-gray-400 text-lg">
            Be the first to share an update!
          </p>
        </div>
      )}
    </div>
  );
}
