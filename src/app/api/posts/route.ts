import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search") || ""
        const tag = searchParams.get("tag") || ""
        const sort = searchParams.get("sort") || "latest"
        const session = await getServerSession(authOptions) as Session

        const skip = (page - 1) * limit

        // Build where clause
        const where: Record<string, unknown> = {
            published: true,
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
            ]
        }

        if (tag) {
            where.tags = {
                some: {
                    tag: {
                        name: { equals: tag, mode: "insensitive" }
                    }
                }
            }
        }

        // Handle interested posts - show posts that the current user has marked as interested
        if (sort === "interested" && session?.user?.id) {
            where.interestedUsers = {
                some: {
                    userId: session.user.id
                }
            }
        }

        // Build orderBy clause based on sort parameter
        let orderBy: any = { createdAt: "desc" }

        switch (sort) {
            case "viral":
                // For viral posts, we need to order by engagement (likes + comments)
                // Since Prisma doesn't support complex ordering by counts directly,
                // we'll order by creation date for now and handle sorting in the frontend
                orderBy = { createdAt: "desc" }
                break
            case "trending":
                // Posts with high engagement in the last 7 days
                const sevenDaysAgo = new Date()
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
                where.createdAt = { gte: sevenDaysAgo }
                orderBy = { createdAt: "desc" }
                break
            case "interested":
                // For interested posts, order by when they were saved (most recent first)
                orderBy = { createdAt: "desc" }
                break
            case "latest":
            default:
                orderBy = { createdAt: "desc" }
                break
        }

        const posts = await db.post.findMany({
            where,
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
                interestedUsers: {
                    select: {
                        userId: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
            orderBy,
            skip,
            take: limit,
        })

        // Sort posts by engagement for viral posts
        let sortedPosts = posts;
        if (sort === "viral") {
            sortedPosts = posts.sort((a, b) => {
                const aEngagement = a._count.likes + a._count.comments;
                const bEngagement = b._count.likes + b._count.comments;
                return bEngagement - aEngagement;
            });
        }

        const total = await db.post.count({ where })

        return NextResponse.json({
            posts: sortedPosts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Error fetching posts:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions) as Session;

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const { title, content, imageUrl, tags } = await request.json()

        if (!title || !content) {
            return NextResponse.json(
                { message: "Title and content are required" },
                { status: 400 }
            )
        }

        // Create post with tags
        const post = await db.post.create({
            data: {
                title,
                content,
                imageUrl,
                published: true,
                tags: {
                    create: tags?.map((tagName: string) => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tagName.toLowerCase() },
                                create: {
                                    name: tagName.toLowerCase(),
                                    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
                                },
                            },
                        },
                    })) || [],
                },
                author: {
                    connect: { id: session.user.id }
                },
            },
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
            },
        })

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error("Error creating post:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
} 