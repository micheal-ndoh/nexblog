import { notFound } from "next/navigation";
import { Comments } from "@/components/comments";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string) {
  try {
    const post = await db.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-0 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <article className="glassmorphism-card rounded-xl overflow-hidden">
          {/* Post Header */}
          <div className="p-4 sm:p-6 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <Link
                href={`/users/${post.author.id}`}
                className="hover:opacity-80 transition-opacity"
              >
                {post.author.image ? (
                  <img
                    src={post.author.image}
                    alt={post.author.name || "User"}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold">
                    {post.author.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/users/${post.author.id}`}
                  className="font-medium text-white hover:text-orange-400 transition-colors text-sm sm:text-base truncate block"
                >
                  {post.author.name || "Anonymous"}
                </Link>
                <p className="text-xs sm:text-sm text-gray-400">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              {post.title}
            </h1>

            {post.imageUrl && (
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-3 sm:mb-4">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {post.tags.map((postTag) => (
                  <span
                    key={postTag.tag.id}
                    className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                    style={{
                      backgroundColor: `${postTag.tag.color}20`,
                      color: postTag.tag.color,
                    }}
                  >
                    #{postTag.tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="p-4 sm:p-6">
            <div className="prose max-w-none max-h-[50vh] sm:max-h-[60vh] overflow-auto">
              <div className="whitespace-pre-wrap text-white leading-relaxed text-sm sm:text-base">
                {post.content}
              </div>
            </div>
          </div>

          {/* Post Footer */}
          <div className="px-0 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-700 bg-gray-800/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm">
                    {post._count.likes} likes
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm">
                    {post._count.comments} comments
                  </span>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                {post.published ? "Published" : "Draft"}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div
          id="comments"
          className="mt-6 sm:mt-8 glassmorphism-card rounded-xl p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
            Comments ({post._count.comments})
          </h2>
          <Comments postId={post.id} initialComments={post.comments} />
        </div>
      </main>
    </div>
  );
}
