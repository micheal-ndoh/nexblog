import { Layout } from "@/components/layout";
import { PostFeed } from "@/components/post-feed";
import { PostFeedSkeleton } from "@/components/post-feed-skeleton";
import { Suspense } from "react";

export default function InsightsPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-0 sm:px-4 lg:px-8 py-8 sm:px-6 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8">
          Insights
        </h1>

        <div className="glassmorphism-card p-6 sm:p-8 rounded-2xl mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
            Latest Insights
          </h2>
          <p className="text-gray-400">
            Discover valuable insights, tips, and strategies from our team of
            experts. Stay updated with the latest trends and best practices in
            content creation.
          </p>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">
              All Posts
            </h3>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-gray-400 text-sm sm:text-base">
                Sort by:
              </span>
              <button className="bg-gray-800 px-3 sm:px-4 py-2 rounded-lg flex items-center text-white hover:bg-gray-700 transition-colors text-sm sm:text-base">
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
