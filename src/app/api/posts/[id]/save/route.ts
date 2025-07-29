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
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user has saved this post
        const savedPost = await db.interestedPost.findUnique({
            where: {
                userId_postId: {
                    postId: id,
                    userId: session.user.id,
                },
            },
        });

        return NextResponse.json({ saved: !!savedPost });
    } catch (error) {
        console.error("Error checking save status:", error);
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
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user already saved the post
        const existingSave = await db.interestedPost.findUnique({
            where: {
                userId_postId: {
                    postId: id,
                    userId: session.user.id,
                },
            },
        });

        if (existingSave) {
            // Unsave the post
            await db.interestedPost.delete({
                where: {
                    userId_postId: {
                        postId: id,
                        userId: session.user.id,
                    },
                },
            });

            return NextResponse.json({ saved: false });
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

            // Get the current user's name
            const currentUser = await db.user.findUnique({
                where: { id: session.user.id },
                select: { name: true },
            });

            // Don't create notification if user is saving their own post
            if (post.author.id !== session.user.id) {
                // Create notification for the post author
                await db.notification.create({
                    data: {
                        type: "INTERESTED_UPDATE",
                        title: "Someone is interested in your post",
                        message: `${currentUser?.name || 'A user'} is interested in your post "${post.title}"`,
                        userId: post.author.id,
                        postId: id,
                    },
                });
            }

            // Save the post
            await db.interestedPost.create({
                data: {
                    postId: id,
                    userId: session.user.id,
                },
            });

            return NextResponse.json({ saved: true });
        }
    } catch (error) {
        console.error("Error toggling save:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
} 