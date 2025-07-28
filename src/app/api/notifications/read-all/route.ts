import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        // Mark all user notifications as read
        await db.notification.updateMany({
            where: {
                userId: session.user.id,
                read: false,
            },
            data: {
                read: true,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error marking all notifications as read:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
} 