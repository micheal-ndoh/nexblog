import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string; action: string }> }
) {
    try {
        const session = await getServerSession(authOptions) as Session;
        const { userId, action } = await params;

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        // Prevent admin from modifying themselves
        if (userId === session.user.id) {
            return NextResponse.json(
                { message: "Cannot modify your own account" },
                { status: 400 }
            )
        }

        const user = await db.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true, isBanned: true }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        switch (action) {
            case "ban":
                if (user.isBanned) {
                    return NextResponse.json(
                        { message: "User is already banned" },
                        { status: 400 }
                    )
                }
                await db.user.update({
                    where: { id: userId },
                    data: { isBanned: true }
                });
                return NextResponse.json({ message: "User banned successfully" });

            case "unban":
                if (!user.isBanned) {
                    return NextResponse.json(
                        { message: "User is not banned" },
                        { status: 400 }
                    )
                }
                await db.user.update({
                    where: { id: userId },
                    data: { isBanned: false }
                });
                return NextResponse.json({ message: "User unbanned successfully" });

            case "promote":
                if (user.role === "ADMIN") {
                    return NextResponse.json(
                        { message: "User is already an admin" },
                        { status: 400 }
                    )
                }
                await db.user.update({
                    where: { id: userId },
                    data: { role: "ADMIN" }
                });
                return NextResponse.json({ message: "User promoted to admin successfully" });

            case "demote":
                if (user.role === "USER") {
                    return NextResponse.json(
                        { message: "User is already a regular user" },
                        { status: 400 }
                    )
                }
                await db.user.update({
                    where: { id: userId },
                    data: { role: "USER" }
                });
                return NextResponse.json({ message: "User demoted successfully" });

            case "delete":
                // Delete all user data (posts, comments, likes, etc.)
                await db.user.delete({
                    where: { id: userId }
                });
                return NextResponse.json({ message: "User deleted successfully" });

            default:
                return NextResponse.json(
                    { message: "Invalid action" },
                    { status: 400 }
                )
        }
    } catch (error) {
        console.error("Error performing user action:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
} 