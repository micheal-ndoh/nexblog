import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const postId = params.id;
        const userId = session.user.id;

        // Check if post exists
        const post = await db.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Check if already saved
        const existingSave = await db.interestedPost.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        if (existingSave) {
            // Remove save
            await db.interestedPost.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    },
                },
            });
            return NextResponse.json({ saved: false });
        } else {
            // Add save
            await db.interestedPost.create({
                data: {
                    userId,
                    postId,
                },
            });
            return NextResponse.json({ saved: true });
        }
    } catch (error) {
        console.error("Error saving post:", error);
        return NextResponse.json(
            { error: "Failed to save post" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const postId = params.id;
        const userId = session.user.id;

        const saved = await db.interestedPost.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        return NextResponse.json({ saved: !!saved });
    } catch (error) {
        console.error("Error checking save status:", error);
        return NextResponse.json(
            { error: "Failed to check save status" },
            { status: 500 }
        );
    }
} 