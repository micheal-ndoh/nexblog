import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const comments = await db.comment.findMany({
            where: {
                postId: id,
            },
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
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions) as { user?: { id?: string } };

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { content } = await request.json();

        if (!content || !content.trim()) {
            return NextResponse.json(
                { message: "Comment content is required" },
                { status: 400 }
            );
        }

        // Verify the post exists and get author info
        const post = await db.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

        // Get the current user's name
        const currentUser = await db.user.findUnique({
            where: { id: session.user.id },
            select: { name: true },
        });

        const comment = await db.comment.create({
            data: {
                content: content.trim(),
                postId: id,
                authorId: session.user.id
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        // Don't create notification if user is commenting on their own post
        if (post.author.id !== session.user.id) {
            // Create notification for the post author
            await db.notification.create({
                data: {
                    type: "COMMENT",
                    title: "New comment on your post",
                    message: `${currentUser?.name || 'A user'} commented on your post "${post.title}"`,
                    userId: post.author.id,
                    postId: id,
                    commentId: comment.id,
                },
            });
        }

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
} 