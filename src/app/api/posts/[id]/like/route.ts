import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user exists in the database
        const dbUser = await db.user.findUnique({ where: { id: session.user.id } });
        if (!dbUser) {
            console.error('User not found for like creation:', session.user.id);
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Check if user already liked the post
        const existingLike = await db.like.findUnique({
            where: {
                userId_postId: {
                    postId: id,
                    userId: session.user.id,
                },
            },
        });

        if (existingLike) {
            // Unlike the post
            await db.like.delete({
                where: {
                    userId_postId: {
                        postId: id,
                        userId: session.user.id,
                    },
                },
            });

            return NextResponse.json({ liked: false });
        } else {
            // Get the post to find the author
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

            // Don't create notification if user is liking their own post
            if (post.author.id !== session.user.id) {
                // Create notification for the post author
                await db.notification.create({
                    data: {
                        type: "LIKE",
                        title: "Someone liked your post",
                        message: `${dbUser.name} liked your post "${post.title}"`,
                        userId: post.author.id,
                        postId: id,
                    },
                });
            }

            // Like the post
            await db.like.create({
                data: {
                    postId: id,
                    userId: session.user.id,
                },
            });

            return NextResponse.json({ liked: true });
        }
    } catch (error) {
        console.error("Error toggling like:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
} 