import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateImageUrls() {
  try {
    console.log('Starting image URL update...');

    // Update User profile images
    const users = await prisma.user.findMany({
      where: {
        image: {
          contains: '10.38.229.234:9000'
        }
      }
    });

    console.log(`Found ${users.length} users with MinIO image URLs`);

    for (const user of users) {
      const newImageUrl = user.image.replace(
        'http://10.38.229.234:9000/nexblog',
        'https://s3.cubbit.eu/nexblog'
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { image: newImageUrl }
      });

      console.log(`Updated user ${user.id}: ${user.image} -> ${newImageUrl}`);
    }

    // Update Post images
    const posts = await prisma.post.findMany({
      where: {
        imageUrl: {
          contains: '10.38.229.234:9000'
        }
      }
    });

    console.log(`Found ${posts.length} posts with MinIO image URLs`);

    for (const post of posts) {
      const newImageUrl = post.imageUrl.replace(
        'http://10.38.229.234:9000/nexblog',
        'https://s3.cubbit.eu/nexblog'
      );

      await prisma.post.update({
        where: { id: post.id },
        data: { imageUrl: newImageUrl }
      });

      console.log(`Updated post ${post.id}: ${post.imageUrl} -> ${newImageUrl}`);
    }

    console.log('Image URL update completed successfully!');
  } catch (error) {
    console.error('Error updating image URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateImageUrls(); 