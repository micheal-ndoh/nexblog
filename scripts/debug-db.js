import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugDatabase() {
    try {
        console.log('=== DATABASE DEBUG ===\n');

        // Check all users
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true
            }
        });

        console.log(`Total users: ${allUsers.length}`);
        allUsers.forEach(user => {
            console.log(`- ${user.name} (${user.email}): ${user.image || 'No image'}`);
        });

        // Check all posts
        const allPosts = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                imageUrl: true,
                createdAt: true,
                author: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        });

        console.log(`\nTotal posts: ${allPosts.length}`);
        allPosts.forEach(post => {
            console.log(`- "${post.title}" by ${post.author.name}: ${post.imageUrl || 'No image'}`);
            console.log(`  Author image: ${post.author.image || 'No image'}`);
        });

        // Check for any MinIO URLs specifically
        const minioUsers = await prisma.user.findMany({
            where: {
                OR: [
                    { image: { contains: '10.38.229.234' } },
                    { image: { contains: 'minio' } }
                ]
            }
        });

        const minioPosts = await prisma.post.findMany({
            where: {
                OR: [
                    { imageUrl: { contains: '10.38.229.234' } },
                    { imageUrl: { contains: 'minio' } }
                ]
            }
        });

        console.log(`\n=== MINIO URL CHECK ===`);
        console.log(`Users with MinIO URLs: ${minioUsers.length}`);
        console.log(`Posts with MinIO URLs: ${minioPosts.length}`);

        if (minioUsers.length > 0) {
            console.log('\nUsers with MinIO URLs:');
            minioUsers.forEach(user => {
                console.log(`- ${user.name}: ${user.image}`);
            });
        }

        if (minioPosts.length > 0) {
            console.log('\nPosts with MinIO URLs:');
            minioPosts.forEach(post => {
                console.log(`- "${post.title}": ${post.imageUrl}`);
            });
        }

    } catch (error) {
        console.error('Error debugging database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

debugDatabase(); 