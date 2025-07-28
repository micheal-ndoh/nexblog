"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { PostFeed } from "@/components/post-feed";
import { PostFeedSkeleton } from "@/components/post-feed-skeleton";
import { Suspense } from "react";
import {
  FireIcon,
  HeartIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

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
}

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("viral");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts?sort=${activeTab}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "viral",
      name: "Viral",
      icon: FireIcon,
      description: "Most popular posts",
    },
    {
      id: "trending",
      name: "Trending",
      icon: ArrowTrendingUpIcon,
      description: "Rising in popularity",
    },
    {
      id: "interested",
      name: "Interested",
      icon: HeartIcon,
      description: "Posts you might like",
    },
    {
      id: "latest",
      name: "Latest",
      icon: EyeIcon,
      description: "Fresh content",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Explore
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover trending content and viral posts
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                {(() => {
                  const activeTabData = tabs.find(
                    (tab) => tab.id === activeTab
                  );
                  const Icon = activeTabData?.icon || FireIcon;
                  return <Icon className="h-6 w-6 text-primary" />;
                })()}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {tabs.find((tab) => tab.id === activeTab)?.name} Posts
                </h2>
              </div>

              {loading ? (
                <PostFeedSkeleton />
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={post.author.image || "/default-avatar.png"}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {post.author.name}
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {post.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            {post.content.length > 150
                              ? `${post.content.substring(0, 150)}...`
                              : post.content}
                          </p>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag.tag.name}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
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

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <HeartIcon className="h-4 w-4" />
                              <span>{post._count.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <EyeIcon className="h-4 w-4" />
                              <span>{post._count.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}

                  {posts.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-500 dark:text-gray-400 mb-4">
                        <FireIcon className="mx-auto h-12 w-12" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No {activeTab} posts yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Check back later for trending content!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Trending Tags
              </h3>
              <div className="space-y-2">
                {[
                  { name: "feature", count: 42, color: "#3b82f6" },
                  { name: "bugfix", count: 28, color: "#ef4444" },
                  { name: "improvement", count: 35, color: "#10b981" },
                  { name: "security", count: 19, color: "#f59e0b" },
                  { name: "update", count: 31, color: "#8b5cf6" },
                ].map((tag) => (
                  <div
                    key={tag.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <span
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                      }}
                    >
                      #{tag.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {tag.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Authors */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Authors
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Admin User", posts: 15, followers: 234 },
                  { name: "Regular User", posts: 8, followers: 156 },
                  { name: "Tech Writer", posts: 12, followers: 189 },
                  { name: "Product Manager", posts: 6, followers: 98 },
                ].map((author, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {author.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {author.posts} posts • {author.followers} followers
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Platform Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Posts
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    1,234
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Active Users
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    567
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Likes
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    8,901
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Comments
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    2,345
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
