import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const postId = params.id

        // Check if post exists
        const post = await db.post.findUnique({
            where: { id: postId },
        })

        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            )
        }

        // Check if user already liked the post
        const existingLike = await db.like.findUnique({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId,
                },
            },
        })

        if (existingLike) {
            // Unlike the post
            await db.like.delete({
                where: {
                    userId_postId: {
                        userId: session.user.id,
                        postId,
                    },
                },
            })

            return NextResponse.json({ liked: false })
        } else {
            // Like the post
            await db.like.create({
                data: {
                    userId: session.user.id,
                    postId,
                },
            })

            return NextResponse.json({ liked: true })
        }
    } catch (error) {
        console.error("Error toggling like:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
} 