import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkImageUrls() {
    try {
        console.log('Checking image URLs in database...');

        // Check User profile images
        const users = await prisma.user.findMany({
            where: {
                image: {
                    not: null
                }
            },
            select: {
                id: true,
                name: true,
                image: true
            }
        });

        console.log(`\nFound ${users.length} users with profile images:`);
        users.forEach(user => {
            console.log(`- ${user.name} (${user.id}): ${user.image}`);
        });

        // Check Post images
        const posts = await prisma.post.findMany({
            where: {
                imageUrl: {
                    not: null
                }
            },
            select: {
                id: true,
                title: true,
                imageUrl: true
            }
        });

        console.log(`\nFound ${posts.length} posts with images:`);
        posts.forEach(post => {
            console.log(`- ${post.title} (${post.id}): ${post.imageUrl}`);
        });

        // Check for MinIO URLs specifically
        const minioUsers = await prisma.user.findMany({
            where: {
                image: {
                    contains: '10.38.229.234'
                }
            }
        });

        const minioPosts = await prisma.post.findMany({
            where: {
                imageUrl: {
                    contains: '10.38.229.234'
                }
            }
        });

        console.log(`\nFound ${minioUsers.length} users with MinIO URLs`);
        console.log(`Found ${minioPosts.length} posts with MinIO URLs`);

    } catch (error) {
        console.error('Error checking image URLs:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkImageUrls(); 