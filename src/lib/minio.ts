import { Client } from "minio";

const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT || "10.38.229.234",
    port: parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || "minio",
    secretKey: process.env.MINIO_SECRET_KEY || "minio123",
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "nexblog";

// Ensure bucket exists
export async function ensureBucket() {
    try {
        const exists = await minioClient.bucketExists(BUCKET_NAME);
        if (!exists) {
            await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
            console.log(`Bucket '${BUCKET_NAME}' created successfully`);
        }
    } catch (error) {
        console.error("Error ensuring bucket exists:", error);
    }
}

// Upload file to MinIO
export async function uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    try {
        await ensureBucket();

        const objectName = `${Date.now()}-${fileName}`;
        await minioClient.putObject(BUCKET_NAME, objectName, file, {
            "Content-Type": contentType,
        });

        const fileUrl = await minioClient.presignedGetObject(BUCKET_NAME, objectName, 24 * 60 * 60); // 24 hours
        return fileUrl;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file");
    }
}

// Delete file from MinIO
export async function deleteFile(fileName: string): Promise<void> {
    try {
        await minioClient.removeObject(BUCKET_NAME, fileName);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw new Error("Failed to delete file");
    }
}

// Generate presigned URL for upload
export async function generatePresignedUrl(
    fileName: string
): Promise<string> {
    try {
        await ensureBucket();

        const objectName = `${Date.now()}-${fileName}`;
        const presignedUrl = await minioClient.presignedPutObject(
            BUCKET_NAME,
            objectName,
            24 * 60 * 60 // 24 hours
        );

        return presignedUrl;
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        throw new Error("Failed to generate upload URL");
    }
}

export default minioClient; 