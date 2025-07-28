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

        const notificationId = params.id

        // Update notification to mark as read
        await db.notification.updateMany({
            where: {
                id: notificationId,
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