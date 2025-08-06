import { Suspense } from "react";
import { PostFeed } from "@/components/post-feed";
import { PostFeedSkeleton } from "@/components/post-feed-skeleton";
import Link from "next/link";
import TopPostsGrid from "@/components/top-posts-grid";

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="text-center mb-16 pt-8 px-4">
        <div className="inline-block glassmorphism-dark rounded-full px-4 py-1 text-sm mb-4">
          <span className="text-orange-400 mr-2">●</span> Latest
        </div>
        <h2 className="text-5xl font-bold mb-6 text-white">
          Discover our Insights
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
          Stay up-to-date with our latest blog posts and insights.
        </p>
      </section>

      {/* Blog Posts Section */}
      <section className="mb-16 max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white">All Blog Posts</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 font-medium">Sort by:</span>
            {/* Sorting buttons will be handled in TopPostsGrid */}
          </div>
        </div>
        <TopPostsGrid />
      </section>

      {/* Main Post Feed */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white">Latest Posts</h2>
        </div>

        <Suspense fallback={<PostFeedSkeleton />}>
          <PostFeed />
        </Suspense>
      </section>
    </div>
  );
}
