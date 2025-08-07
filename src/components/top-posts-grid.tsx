import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";

async function fetchTopPosts(sort: string) {
  let url = `/api/posts?limit=6&sort=${sort}`;
  // If running on the server, construct an absolute URL
  if (typeof window === "undefined") {
    const h = await headers();
    const host = h.get("host");
    const protocol = h.get("x-forwarded-proto") || "http";
    url = `${protocol}://${host}/api/posts?limit=6&sort=${sort}`;
  }
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  return data.posts || [];
}

export default async function TopPostsGrid({
  sort = "likes",
}: {
  sort?: string;
}) {
  const posts = await fetchTopPosts(sort);

  return (
    <>
      {/* Sort Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Link
          href={`?sort=likes`}
          className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
            sort === "likes"
              ? "bg-orange-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          scroll={false}
        >
          Most Liked
        </Link>
        <Link
          href={`?sort=comments`}
          className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
            sort === "comments"
              ? "bg-orange-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          scroll={false}
        >
          Most Commented
        </Link>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        {posts.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-white py-8">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12 sm:h-16 sm:w-16"
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
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              No posts found
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Check back later for updates!
            </p>
          </div>
        ) : (
          posts.map((post: any) => (
            <div
              key={post.id}
              className="glassmorphism-card p-4 sm:p-6 rounded-2xl hover:bg-gray-800/50 transition-all duration-200 hover:scale-105 flex flex-col"
            >
              {/* Post Image */}
              {post.imageUrl && (
                <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={400}
                    height={192}
                    className="object-cover w-full h-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-white text-xs sm:text-sm mb-3 sm:mb-4 max-h-12 sm:max-h-16 overflow-hidden line-clamp-2 sm:line-clamp-3 flex-1">
                  {post.content.length > 80
                    ? post.content.slice(0, 80) + "..."
                    : post.content}
                </p>

                {/* Post Meta */}
                <div className="mt-auto">
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-orange-400 font-medium text-sm sm:text-base hover:underline inline-flex items-center gap-1"
                  >
                    Read more
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
