import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const session = await getServerSession(authOptions) as Session;

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        // Get basic counts
        const [
            totalUsers,
            totalPosts,
            totalComments,
            totalLikes,
            bannedUsers,
            publishedPosts,
            draftPosts,
            recentUsers,
            recentPosts,
            topUsers,
            topPosts
        ] = await Promise.all([
            // Total users
            db.user.count(),

            // Total posts
            db.post.count(),

            // Total comments
            db.comment.count(),

            // Total likes
            db.like.count(),

            // Banned users
            db.user.count({ where: { isBanned: true } }),

            // Published posts
            db.post.count({ where: { published: true } }),

            // Draft posts
            db.post.count({ where: { published: false } }),

            // Recent users (last 7 days)
            db.user.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            }),

            // Recent posts (last 7 days)
            db.post.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            }),

            // Top users by post count
            db.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    _count: {
                        select: {
                            posts: true,
                            comments: true,
                            likes: true
                        }
                    }
                },
                orderBy: {
                    posts: {
                        _count: 'desc'
                    }
                },
                take: 5
            }),

            // Top posts by engagement
            db.post.findMany({
                select: {
                    id: true,
                    title: true,
                    published: true,
                    createdAt: true,
                    author: {
                        select: {
                            name: true
                        }
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true
                        }
                    }
                },
                orderBy: [
                    {
                        likes: {
                            _count: 'desc'
                        }
                    },
                    {
                        comments: {
                            _count: 'desc'
                        }
                    }
                ],
                take: 5
            })
        ]);

        // Calculate engagement rate
        const engagementRate = totalUsers > 0 ? ((totalLikes + totalComments) / totalUsers).toFixed(2) : "0.00";

        // Calculate posts per user
        const postsPerUser = totalUsers > 0 ? (totalPosts / totalUsers).toFixed(2) : "0.00";

        // Get monthly stats for the last 6 months
        const monthlyStats = await Promise.all(
            Array.from({ length: 6 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                return Promise.all([
                    db.user.count({
                        where: {
                            createdAt: {
                                gte: startOfMonth,
                                lte: endOfMonth
                            }
                        }
                    }),
                    db.post.count({
                        where: {
                            createdAt: {
                                gte: startOfMonth,
                                lte: endOfMonth
                            }
                        }
                    })
                ]);
            })
        );

        const monthlyData = monthlyStats.map(([users, posts], index) => {
            const date = new Date();
            date.setMonth(date.getMonth() - index);
            return {
                month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                users,
                posts
            };
        }).reverse();

        return NextResponse.json({
            overview: {
                totalUsers,
                totalPosts,
                totalComments,
                totalLikes,
                bannedUsers,
                publishedPosts,
                draftPosts,
                recentUsers,
                recentPosts,
                engagementRate: parseFloat(engagementRate),
                postsPerUser: parseFloat(postsPerUser)
            },
            topUsers,
            topPosts,
            monthlyData
        });
    } catch (error) {
        console.error("Error fetching analytics:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
} 