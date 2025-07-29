import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/cubbit";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string; // "post" or "profile"

        if (!file) {
            return NextResponse.json(
                { message: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
                { status: 400 }
            );
        }

        // Validate file size (5MB for posts, 2MB for profile pictures)
        const maxSize = type === "profile" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { message: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.` },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${type}/${session.user.id}/${Date.now()}.${fileExtension}`;

        // Upload to MinIO
        const fileUrl = await uploadFile(buffer, fileName, file.type);

        return NextResponse.json({
            url: fileUrl,
            fileName: fileName,
            size: file.size,
            type: file.type,
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { message: "Failed to upload file" },
            { status: 500 }
        );
    }
} 