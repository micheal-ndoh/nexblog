import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
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

        // Build orderBy clause based on sort parameter
        let orderBy: Record<string, unknown> = { createdAt: "desc" }

        switch (sort) {
            case "viral":
                orderBy = [
                    { _count: { likes: "desc" } },
                    { _count: { comments: "desc" } },
                    { createdAt: "desc" }
                ]
                break
            case "trending":
                // Posts with high engagement in the last 7 days
                const sevenDaysAgo = new Date()
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
                where.createdAt = { gte: sevenDaysAgo }
                orderBy = [
                    { _count: { likes: "desc" } },
                    { _count: { comments: "desc" } },
                    { createdAt: "desc" }
                ]
                break
            case "interested":
                // Posts with tags that the user might be interested in
                orderBy = [
                    { _count: { likes: "desc" } },
                    { createdAt: "desc" }
                ]
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

        const total = await db.post.count({ where })

        return NextResponse.json({
            posts,
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
        const session = await getServerSession(authOptions)

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