import { Layout } from "@/components/layout";
import { PostFeed } from "@/components/post-feed";
import { PostFeedSkeleton } from "@/components/post-feed-skeleton";
import { Suspense } from "react";

export default function InsightsPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Insights</h1>

        <div className="glassmorphism-card p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Latest Insights
          </h2>
          <p className="text-gray-400">
            Discover valuable insights, tips, and strategies from our team of
            experts. Stay updated with the latest trends and best practices in
            content creation.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-white">All Posts</h3>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Sort by:</span>
              <button className="bg-gray-800 px-4 py-2 rounded-lg flex items-center text-white hover:bg-gray-700 transition-colors">
                Categories
                <svg
                  className="w-5 h-5 ml-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
            </div>
          </div>

          <Suspense fallback={<PostFeedSkeleton />}>
            <PostFeed />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}
