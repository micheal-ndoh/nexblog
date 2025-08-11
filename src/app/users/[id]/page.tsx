import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Image from "next/image";

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

async function getUser(id: string) {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        posts: {
          where: { published: true },
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
        },
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  // Profile view notification logic
  const session = await getServerSession(authOptions);
  if (session?.user?.id && session.user.id !== id) {
    // Fire and forget, don't await
    fetch(`/api/user/profile-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileUserId: id }),
    });
  }

  return (
    <div className="container mx-auto px-0 sm:px-4 lg:px-8 py-8 max-w-4xl">
      {/* User Profile Header */}
      <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-base-content mb-2">
              {user.name || "Anonymous User"}
            </h1>
            <p className="text-base-content/70 mb-4">{user.email}</p>
            <div className="flex space-x-6 text-sm text-base-content/60">
              <div>
                <span className="font-semibold">{user._count.posts}</span> posts
              </div>
              <div>
                <span className="font-semibold">{user._count.comments}</span>{" "}
                comments
              </div>
              <div>
                Member since{" "}
                <span className="font-semibold">
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-base-content mb-4">
          Posts by {user.name || "Anonymous User"}
        </h2>

        {user.posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No posts yet
            </h3>
            <p className="text-base-content/70">
              {user.name || "This user"} hasn&apos;t published any posts yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {user.posts.map((post) => (
              <article
                key={post.id}
                className="bg-base-100 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/users/${post.author.id}`}
                      className="hover:opacity-80"
                    >
                      {post.author.image ? (
                        <img
                          src={post.author.image}
                          alt={post.author.name || "Author"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">
                          {post.author.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                      )}
                    </Link>
                    <div>
                      <Link
                        href={`/users/${post.author.id}`}
                        className="font-semibold text-base-content hover:text-primary transition-colors"
                      >
                        {post.author.name || "Anonymous"}
                      </Link>
                      <p className="text-sm text-base-content/60">
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <Link href={`/posts/${post.id}`} className="block">
                  <h3 className="text-xl font-bold text-base-content mb-3 hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  {post.imageUrl && (
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  <p className="text-base-content/80 mb-4 line-clamp-3">
                    {post.content.length > 200
                      ? `${post.content.substring(0, 200)}...`
                      : post.content}
                  </p>
                </Link>

                <div className="flex items-center justify-between text-sm text-base-content/60">
                  <div className="flex items-center space-x-4">
                    <span>{post._count.comments} comments</span>
                    <span>{post._count.likes} likes</span>
                  </div>
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-primary hover:text-primary-focus transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
