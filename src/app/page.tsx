import { Suspense } from "react";
import { PostFeed } from "@/components/post-feed";
import { PostFeedSkeleton } from "@/components/post-feed-skeleton";
import Link from "next/link";
import TopPostsGrid from "@/components/top-posts-grid";

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="text-center mb-6 sm:mb-8 lg:mb-16 pt-2 sm:pt-4 lg:pt-8 px-0 sm:px-4 lg:px-8">
        <div className="inline-block glassmorphism-dark rounded-full px-2 sm:px-3 lg:px-4 py-1 text-xs sm:text-sm mb-3 sm:mb-4">
          <span className="text-orange-400 mr-2">●</span> Latest
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 text-white leading-tight">
          Discover our Insights
        </h2>
        <p className="text-gray-300 mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-0 sm:px-4 leading-relaxed">
          Stay up-to-date with our latest blog posts and insights.
        </p>
      </section>

      {/* Blog Posts Section */}
      <section className="mb-6 sm:mb-8 lg:mb-16">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8 px-0 sm:px-4 lg:px-8">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-3 sm:mb-0">
            All Blog Posts
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 font-medium text-xs sm:text-sm lg:text-base">
              Sort by:
            </span>
            {/* Sorting buttons will be handled in TopPostsGrid */}
          </div>
        </div>
        <div className="px-0 sm:px-4 lg:px-8">
          <TopPostsGrid />
        </div>
      </section>

      {/* Main Post Feed */}
      <section className="pb-6 sm:pb-8 lg:pb-16">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8 px-0 sm:px-4 lg:px-8">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-3 sm:mb-0">
            Latest Posts
          </h2>
        </div>

        <div className="px-0 sm:px-4 lg:px-8">
          <Suspense fallback={<PostFeedSkeleton />}>
            <PostFeed />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
