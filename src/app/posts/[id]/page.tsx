
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Comments } from "@/components/comments";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href={`/users/${post.author.id}`}
                className="hover:opacity-80 transition-opacity"
              >
                {post.author.image ? (
                  <img
                    src={post.author.image}
                    alt={post.author.name || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">
                    {post.author.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </Link>
              <div>
                <Link
                  href={`/users/${post.author.id}`}
                  className="font-medium text-gray-900 dark:text-white hover:text-primary transition-colors"
                >
                  {post.author.name || "Anonymous"}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>

            {post.imageUrl && (
              <div className="mb-4">
                <img
                  src={post.imageUrl}
                  alt="Featured image"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((postTag) => (
                  <span
                    key={postTag.tag.id}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
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
          <div className="p-6">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {post.content}
              </div>
            </div>
          </div>

          {/* Post Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-5 h-5"
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
                  <span className="text-sm">{post._count.likes} likes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-5 h-5"
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
                  <span className="text-sm">
                    {post._count.comments} comments
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {post.published ? "Published" : "Draft"}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div
          id="comments"
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Comments ({post._count.comments})
          </h2>
          <Comments postId={post.id} initialComments={post.comments} />
        </div>
      </main>
    </div>
  );
}
