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

        // Check if user already liked the post
        const existingLike = await db.like.findUnique({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId: id,
                },
            },
        });

        if (existingLike) {
            // Unlike the post
            await db.like.delete({
                where: {
                    userId_postId: {
                        userId: session.user.id,
                        postId: id,
                    },
                },
            });

            return NextResponse.json({ liked: false });
        } else {
            // Like the post
            await db.like.create({
                data: {
                    userId: session.user.id,
                    postId: id,
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