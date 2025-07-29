import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ postId: string; action: string }> }
) {
    try {
        const session = await getServerSession(authOptions) as Session;
        const { postId, action } = await params;

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const post = await db.post.findUnique({
            where: { id: postId },
            select: {
                id: true,
                published: true,
                authorId: true,
                title: true
            }
        });

        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            )
        }

        switch (action) {
            case "approve":
                if (post.published) {
                    return NextResponse.json(
                        { message: "Post is already published" },
                        { status: 400 }
                    )
                }
                await db.post.update({
                    where: { id: postId },
                    data: { published: true }
                });
                return NextResponse.json({ message: "Post approved and published successfully" });

            case "reject":
                if (!post.published) {
                    return NextResponse.json(
                        { message: "Post is already unpublished" },
                        { status: 400 }
                    )
                }
                await db.post.update({
                    where: { id: postId },
                    data: { published: false }
                });
                return NextResponse.json({ message: "Post rejected and unpublished successfully" });

            case "delete":
                // Delete the post and all related data
                await db.post.delete({
                    where: { id: postId }
                });
                return NextResponse.json({ message: "Post deleted successfully" });

            default:
                return NextResponse.json(
                    { message: "Invalid action" },
                    { status: 400 }
                )
        }
    } catch (error) {
        console.error("Error performing post action:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
} 