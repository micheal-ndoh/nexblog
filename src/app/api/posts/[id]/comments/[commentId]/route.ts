import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; commentId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Find the comment and verify ownership
        const comment = await db.comment.findUnique({
            where: { id: params.commentId },
            include: {
                author: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!comment) {
            return NextResponse.json(
                { message: "Comment not found" },
                { status: 404 }
            );
        }

        // Check if user is the author of the comment
        if (comment.author.id !== session.user.id) {
            return NextResponse.json(
                { message: "You can only delete your own comments" },
                { status: 403 }
            );
        }

        // Delete the comment
        await db.comment.delete({
            where: { id: params.commentId },
        });

        return NextResponse.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
} 