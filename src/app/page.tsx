import { Suspense } from "react";
import { Header } from "@/components/header";
import { PostFeed } from "@/components/post-feed";
import { PostFeedSkeleton } from "@/components/post-feed-skeleton";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Latest Updates
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay up to date with the latest changes and announcements
          </p>
        </div>

        <Suspense fallback={<PostFeedSkeleton />}>
          <PostFeed />
        </Suspense>
      </main>
    </div>
  );
}
