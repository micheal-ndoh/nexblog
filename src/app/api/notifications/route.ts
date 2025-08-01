import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const session = await getServerSession(authOptions) as Session;

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const notifications = await db.notification.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        id: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 50,
        })

        // Add postId and commentId to the response for clickable notifications
        const notificationsWithLinks = notifications.map(n => ({
            ...n,
            user: n.user,
            postId: n.postId,
            commentId: n.commentId,
        }));

        return NextResponse.json(notificationsWithLinks)
    } catch (error) {
        console.error("Error fetching notifications:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
} 