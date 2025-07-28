const { Client } = require('minio');

const minioClient = new Client({
    endPoint: '10.38.229.234',
    port: 9000,
    useSSL: false,
    accessKey: 'minio',
    secretKey: 'minio123',
});

async function testMinIO() {
    try {
        console.log('Testing MinIO connection...');

        // Test bucket existence
        const bucketExists = await minioClient.bucketExists('nexblog');
        console.log('Bucket "nexblog" exists:', bucketExists);

        if (!bucketExists) {
            console.log('Creating bucket "nexblog"...');
            await minioClient.makeBucket('nexblog', 'us-east-1');
            console.log('Bucket created successfully!');
        }

        console.log('MinIO connection successful!');
    } catch (error) {
        console.error('MinIO connection failed:', error.message);
    }
}

testMinIO(); 