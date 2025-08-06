import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";

async function fetchTopPosts(sort: string) {
  let url = `/api/posts?limit=6&sort=${sort}`;
  // If running on the server, construct an absolute URL
  if (typeof window === "undefined") {
    const h = headers();
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
      <div className="flex items-center space-x-4 mb-6">
        <Link
          href={`?sort=likes`}
          className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
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
          className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
            sort === "comments"
              ? "bg-orange-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          scroll={false}
        >
          Most Commented
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {posts.length === 0 ? (
          <div className="col-span-3 text-center text-white">
            No posts found.
          </div>
        ) : (
          posts.map((post: any) => (
            <div
              key={post.id}
              className="glassmorphism-card p-6 rounded-2xl hover:bg-gray-800/50 transition-all duration-200 hover:scale-105 flex flex-col"
            >
              {post.imageUrl && (
                <div className="w-full h-48 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={400}
                    height={192}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2 text-white truncate">
                {post.title}
              </h3>
              <p className="text-white text-sm mb-4 max-h-16 overflow-hidden">
                {post.content.length > 100
                  ? post.content.slice(0, 100) + "..."
                  : post.content}
              </p>
              <Link
                href={`/posts/${post.id}`}
                className="text-orange-400 font-medium mt-auto hover:underline"
              >
                See more...
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
}
