import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const cubbitClient = new S3Client({
    region: "auto",
    endpoint: "https://s3.cubbit.eu",
    credentials: {
        accessKeyId: process.env.CUBBIT_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CUBBIT_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
});

const BUCKET_NAME = process.env.CUBBIT_BUCKET_NAME || "nexblog";

// Upload file to Cubbit
export async function uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    try {
        const objectName = `${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: objectName,
            Body: file,
            ContentType: contentType,
        });

        await cubbitClient.send(command);

        // Generate presigned URL for 24 hours
        const getCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: objectName,
        });

        const fileUrl = await getSignedUrl(cubbitClient, getCommand, { expiresIn: 24 * 60 * 60 });
        return fileUrl;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file");
    }
}

// Delete file from Cubbit
export async function deleteFile(fileName: string): Promise<void> {
    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
        });

        await cubbitClient.send(command);
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
        const objectName = `${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: objectName,
        });

        const presignedUrl = await getSignedUrl(cubbitClient, command, { expiresIn: 24 * 60 * 60 });
        return presignedUrl;
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        throw new Error("Failed to generate upload URL");
    }
}

export default cubbitClient; 