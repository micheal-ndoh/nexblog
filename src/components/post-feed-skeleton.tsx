export function PostFeedSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="post-container p-4 sm:p-6 animate-pulse">
          {/* Post Header Skeleton */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <div className="h-4 bg-gray-700 rounded w-20 sm:w-24 animate-pulse" />
                <div className="h-3 bg-gray-700 rounded w-12 sm:w-16 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Post Content Skeleton */}
          <div className="mb-4">
            <div className="h-5 sm:h-6 bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse" />
            </div>
          </div>

          {/* Tags Skeleton */}
          <div className="flex gap-1.5 sm:gap-2 mb-4">
            <div className="h-5 sm:h-6 bg-gray-700 rounded-full w-12 sm:w-16 animate-pulse" />
            <div className="h-5 sm:h-6 bg-gray-700 rounded-full w-16 sm:w-20 animate-pulse" />
          </div>

          {/* Post Actions Skeleton */}
          <div className="flex items-center gap-3 sm:gap-6 pt-3 sm:pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="h-5 w-5 sm:h-5 sm:w-5 bg-gray-700 rounded animate-pulse" />
              <div className="h-3 sm:h-4 bg-gray-700 rounded w-6 sm:w-8 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="h-5 w-5 sm:h-5 sm:w-5 bg-gray-700 rounded animate-pulse" />
              <div className="h-3 sm:h-4 bg-gray-700 rounded w-6 sm:w-8 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="h-5 w-5 sm:h-5 sm:w-5 bg-gray-700 rounded animate-pulse" />
              <div className="h-3 sm:h-4 bg-gray-700 rounded w-8 sm:w-12 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
