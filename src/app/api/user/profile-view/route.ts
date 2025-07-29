import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const { profileUserId } = await request.json();
        if (!profileUserId || profileUserId === session.user.id) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }
        // Get viewer's name
        const viewer = await db.user.findUnique({ where: { id: session.user.id }, select: { name: true } });
        // Create notification for the profile owner
        await db.notification.create({
            data: {
                type: "PROFILE_VIEW",
                title: "Someone viewed your profile",
                message: `${viewer?.name || 'A user'} viewed your profile`,
                userId: profileUserId,
            },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error creating profile view notification:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
} 