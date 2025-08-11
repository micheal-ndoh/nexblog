"use client";

import { useState, useEffect, useCallback } from "react";
import { PostFeedSkeleton } from "@/components/post-feed-skeleton";
import Image from "next/image";
import Link from "next/link";
import {
  FireIcon,
  HeartIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { useT } from "@/lib/tolgee";

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
  const { t } = useT();

  const fetchPosts = useCallback(async () => {
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
  }, [activeTab]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const tabs = [
    {
      id: "viral",
      name: t("explore.viral"),
      icon: FireIcon,
      description: t("explore.viralDescription"),
    },
    {
      id: "trending",
      name: t("explore.trending"),
      icon: ArrowTrendingUpIcon,
      description: t("explore.trendingDescription"),
    },
    {
      id: "interested",
      name: t("explore.interested"),
      icon: HeartIcon,
      description: t("explore.interestedDescription"),
    },
    {
      id: "latest",
      name: t("explore.latest"),
      icon: EyeIcon,
      description: t("explore.latestDescription"),
    },
  ];

  const getNoPostsMessage = () => {
    switch (activeTab) {
      case "viral":
        return t("explore.noViralPosts");
      case "trending":
        return t("explore.noTrendingPosts");
      case "interested":
        return t("explore.noInterestedPosts");
      case "latest":
        return t("explore.noLatestPosts");
      default:
        return t("posts.noPosts");
    }
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-0 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {t("explore.title")}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {t("explore.subtitle")}
          </p>
        </div>
        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex flex-wrap space-x-4 sm:space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-orange-500 text-orange-500"
                        : "border-transparent text-gray-400 hover:text-gray-300"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="glassmorphism-card rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                {(() => {
                  const activeTabData = tabs.find(
                    (tab) => tab.id === activeTab
                  );
                  const Icon = activeTabData?.icon || FireIcon;
                  return <Icon className="h-6 w-6 text-orange-500" />;
                })()}
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  {tabs.find((tab) => tab.id === activeTab)?.name}{" "}
                  {t("posts.title")}
                </h2>
              </div>

              {loading ? (
                <PostFeedSkeleton />
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.id}`}
                      className="block glassmorphism-card rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <article>
                        <div className="flex items-start gap-4">
                          <Image
                            src={post.author.image || "/default-avatar.png"}
                            alt={post.author.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-2">
                              <h3 className="font-semibold text-white">
                                {post.author.name}
                              </h3>
                              <span className="text-sm text-gray-400">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="text-lg font-medium text-white mb-2">
                              {post.title}
                            </h4>
                            <p className="text-gray-300 text-sm mb-3">
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
                            <div className="flex items-center gap-4 text-sm text-gray-400">
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
                    </Link>
                  ))}

                  {posts.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <FireIcon className="mx-auto h-12 w-12" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        {getNoPostsMessage()}
                      </h3>
                      <p className="text-gray-400">
                        {t("explore.checkBackLater")}
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
            <div className="glassmorphism-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t("explore.trendingTags")}
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
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
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
                    <span className="text-sm text-gray-400">{tag.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Authors */}
            <div className="glassmorphism-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t("explore.topAuthors")}
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
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {author.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {author.posts} {t("posts.title")} • {author.followers}{" "}
                        {t("user.followers")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glassmorphism-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t("explore.platformStats")}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {t("explore.totalPosts")}
                  </span>
                  <span className="text-sm font-medium text-white">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {t("explore.activeUsers")}
                  </span>
                  <span className="text-sm font-medium text-white">567</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {t("explore.totalLikes")}
                  </span>
                  <span className="text-sm font-medium text-white">8,901</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {t("explore.comments")}
                  </span>
                  <span className="text-sm font-medium text-white">2,345</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
