import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions)

        // @ts-expect-error - Session user type is not properly typed in NextAuth
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const notificationId = id

        // Update notification to mark as read
        await db.notification.updateMany({
            where: {
                id: notificationId,
                // @ts-expect-error - Session user type is not properly typed in NextAuth
                // @ts-expect-error - Session user type is not properly typed in NextAuth
                userId: session.user.id,
            },
            data: {
                read: true,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error marking notification as read:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
} 