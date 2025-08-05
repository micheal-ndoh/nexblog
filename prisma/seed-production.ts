import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// External images from Unsplash for production
const LOCAL_IMAGES = [
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
]

// User profile images (using Unsplash for variety)
const PROFILE_IMAGES = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786',
]

function getRandomImage(images: string[]): string {
    return images[Math.floor(Math.random() * images.length)]
}

async function main() {
    console.log('🌱 Seeding production database with comprehensive data...')

    try {
        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 12)
        const admin = await prisma.user.upsert({
            where: { email: 'admin@nexblog.com' },
            update: {},
            create: {
                email: 'admin@nexblog.com',
                name: 'NexBlog Admin',
                password: adminPassword,
                role: 'ADMIN',
                image: PROFILE_IMAGES[0],
            },
        })
        console.log('✅ Admin user created')

        // Create users sequentially to avoid connection issues
        const usersData = [
            { email: 'john.doe@example.com', name: 'John Doe', image: PROFILE_IMAGES[1] },
            { email: 'jane.smith@example.com', name: 'Jane Smith', image: PROFILE_IMAGES[2] },
            { email: 'mike.wilson@example.com', name: 'Mike Wilson', image: PROFILE_IMAGES[3] },
            { email: 'sarah.johnson@example.com', name: 'Sarah Johnson', image: PROFILE_IMAGES[4] },
            { email: 'david.brown@example.com', name: 'David Brown', image: PROFILE_IMAGES[5] },
            { email: 'emma.davis@example.com', name: 'Emma Davis', image: PROFILE_IMAGES[6] },
            { email: 'alex.taylor@example.com', name: 'Alex Taylor', image: PROFILE_IMAGES[7] },
            { email: 'lisa.anderson@example.com', name: 'Lisa Anderson', image: PROFILE_IMAGES[8] },
        ]

        const users: any[] = []
        for (const userData of usersData) {
            const hashedPassword = await bcrypt.hash('user123', 12)
            const user = await prisma.user.upsert({
                where: { email: userData.email },
                update: {},
                create: {
                    email: userData.email,
                    name: userData.name,
                    password: hashedPassword,
                    role: 'USER',
                    image: userData.image,
                },
            })
            users.push(user)
        }
        console.log(`✅ ${users.length} users created`)

        // Create tags
        const tagsData = [
            { name: 'Technology', color: '#3b82f6' },
            { name: 'Programming', color: '#8b5cf6' },
            { name: 'Web Development', color: '#06b6d4' },
            { name: 'Design', color: '#f59e0b' },
            { name: 'Productivity', color: '#10b981' },
            { name: 'Business', color: '#ef4444' },
            { name: 'Innovation', color: '#ec4899' },
            { name: 'Tutorial', color: '#84cc16' },
            { name: 'News', color: '#f97316' },
            { name: 'Tips', color: '#6366f1' },
            { name: 'React', color: '#61dafb' },
            { name: 'Next.js', color: '#000000' },
            { name: 'TypeScript', color: '#3178c6' },
            { name: 'Database', color: '#ff6b6b' },
            { name: 'API', color: '#4ecdc4' },
        ]

        const tags: any[] = []
        for (const tagData of tagsData) {
            const tag = await prisma.tag.upsert({
                where: { name: tagData.name },
                update: {},
                create: { name: tagData.name, color: tagData.color },
            })
            tags.push(tag)
        }
        console.log(`✅ ${tags.length} tags created`)

        // Create posts with simplified content
        const postsData = [
            {
                title: 'Welcome to NexBlog - A Modern Micro-Blogging Platform',
                content: `We're excited to announce the launch of NexBlog, a modern micro-blogging platform built with Next.js 15, Prisma, and TypeScript. This platform provides a clean, fast, and secure way to share updates, changelogs, and thoughts.`,
                authorId: admin.id,
                tags: ['Technology', 'Next.js', 'Web Development'],
                imageUrl: getRandomImage(LOCAL_IMAGES),
            },
            {
                title: 'Building Scalable APIs with Next.js 15',
                content: `Next.js 15 introduces several improvements for API development that make building scalable applications easier than ever. The new App Router provides better performance and more intuitive routing patterns.`,
                authorId: users[0].id,
                tags: ['Programming', 'Next.js', 'API', 'Web Development'],
                imageUrl: getRandomImage(LOCAL_IMAGES),
            },
            {
                title: 'TypeScript Best Practices for 2024',
                content: `TypeScript has evolved significantly over the years, and there are several best practices that can help you write more maintainable and type-safe code.`,
                authorId: users[1].id,
                tags: ['TypeScript', 'Programming', 'Tips'],
                imageUrl: getRandomImage(LOCAL_IMAGES),
            },
            {
                title: 'React Performance Optimization Techniques',
                content: `Performance is crucial for providing a good user experience. Here are some React optimization techniques that can significantly improve your application's performance.`,
                authorId: users[2].id,
                tags: ['React', 'Programming', 'Performance', 'Tips'],
                imageUrl: getRandomImage(LOCAL_IMAGES),
            },
            {
                title: 'The Future of Web Development: What to Expect in 2024',
                content: `Web development is evolving rapidly, and 2024 brings exciting new technologies and trends that will shape how we build applications.`,
                authorId: users[3].id,
                tags: ['Web Development', 'Technology', 'Innovation', 'News'],
                imageUrl: getRandomImage(LOCAL_IMAGES),
            },
            {
                title: 'Design Systems: Building Consistent User Interfaces',
                content: `A well-designed design system is the foundation of consistent and scalable user interfaces. Here's how to build and maintain an effective design system.`,
                authorId: users[4].id,
                tags: ['Design', 'Web Development', 'Tips'],
                imageUrl: getRandomImage(LOCAL_IMAGES),
            },
            {
                title: 'Productivity Tips for Developers',
                content: `Being productive as a developer isn't just about writing code faster. It's about working smarter and creating sustainable habits that improve your overall output.`,
                authorId: users[5].id,
                tags: ['Productivity', 'Tips', 'Programming'],
                imageUrl: getRandomImage(LOCAL_IMAGES),
            },
            {
                title: 'Building Secure Web Applications',
                content: `Security should be a top priority when building web applications. Here are essential security practices that every developer should implement.`,
                authorId: users[6].id,
                tags: ['Security', 'Web Development', 'Tips'],
                imageUrl: getRandomImage(LOCAL_IMAGES),
            },
        ]

        const posts: any[] = []
        for (const postData of postsData) {
            const tagIds = postData.tags.map(tagName =>
                tags.find(tag => tag.name === tagName)?.id
            ).filter(Boolean)

            const post = await prisma.post.create({
                data: {
                    title: postData.title,
                    content: postData.content,
                    authorId: postData.authorId,
                    published: true,
                    imageUrl: postData.imageUrl,
                    tags: {
                        create: tagIds.map(tagId => ({ tagId: tagId! })),
                    },
                },
            })
            posts.push(post)
        }
        console.log(`✅ ${posts.length} posts created`)

        // Create likes sequentially
        let likesCount = 0
        for (const post of posts) {
            const numLikes = Math.floor(Math.random() * 5) + 1 // 1-5 likes per post
            const shuffledUsers = users.sort(() => 0.5 - Math.random())

            for (let i = 0; i < numLikes && i < shuffledUsers.length; i++) {
                try {
                    await prisma.like.create({
                        data: {
                            userId: shuffledUsers[i].id,
                            postId: post.id,
                        },
                    })
                    likesCount++
                } catch (error) {
                    // Skip if like already exists
                }
            }
        }
        console.log(`✅ ${likesCount} likes created`)

        // Create comments
        const commentsData = [
            { content: 'This is exactly what I was looking for! Great work on the platform.', authorId: users[0].id, postId: posts[0].id },
            { content: 'The TypeScript integration looks really clean. Can\'t wait to try it out!', authorId: users[1].id, postId: posts[0].id },
            { content: 'These performance tips are gold. Already implemented some of them!', authorId: users[2].id, postId: posts[3].id },
            { content: 'The database patterns article is very helpful. Thanks for sharing!', authorId: users[3].id, postId: posts[2].id },
            { content: 'Security should always be a priority. Great reminder!', authorId: users[4].id, postId: posts[7].id },
            { content: 'Design systems are crucial for scaling. Love the practical approach here.', authorId: users[5].id, postId: posts[5].id },
        ]

        for (const commentData of commentsData) {
            await prisma.comment.create({
                data: commentData,
            })
        }
        console.log(`✅ ${commentsData.length} comments created`)

        // Create notifications
        const notificationsData = [
            { type: 'LIKE', title: 'New like on your post', message: 'John Doe liked your post "Welcome to NexBlog"', userId: admin.id, postId: posts[0].id },
            { type: 'COMMENT', title: 'New comment on your post', message: 'Jane Smith commented on your post "Welcome to NexBlog"', userId: admin.id, postId: posts[0].id },
            { type: 'LIKE', title: 'New like on your post', message: 'Mike Wilson liked your post "TypeScript Best Practices"', userId: users[1].id, postId: posts[2].id },
        ]

        for (const notificationData of notificationsData) {
            await prisma.notification.create({
                data: notificationData,
            })
        }
        console.log(`✅ ${notificationsData.length} notifications created`)

        console.log('✅ Production database seeded successfully with comprehensive data!')
        console.log('📊 Created:')
        console.log(`   • ${users.length + 1} users (including admin)`)
        console.log(`   • ${tags.length} tags`)
        console.log(`   • ${posts.length} posts`)
        console.log(`   • ${likesCount} likes`)
        console.log(`   • ${commentsData.length} comments`)
        console.log(`   • ${notificationsData.length} notifications`)
        console.log('\n🔑 Login Credentials:')
        console.log('📧 Admin: admin@nexblog.com / admin123')
        console.log('📧 Users: Various emails with password "user123"')
        console.log('\n🎯 The production database now has realistic content with local images!')
        console.log('🌐 Visit: https://nexblog-nine.vercel.app/')

    } catch (error) {
        console.error('❌ Error seeding production database:', error)
        throw error
    }
}

main()
    .catch((e) => {
        console.error('❌ Error seeding production database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 