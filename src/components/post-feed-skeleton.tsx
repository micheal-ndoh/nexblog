export function PostFeedSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6">
            {/* Post Header Skeleton */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Post Content Skeleton */}
            <div className="mb-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse" />
              </div>
            </div>

            {/* Tags Skeleton */}
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse" />
            </div>

            {/* Post Actions Skeleton */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
