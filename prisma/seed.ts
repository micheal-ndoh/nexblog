import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@nexblog.com' },
        update: {},
        create: {
            email: 'admin@nexblog.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
        },
    })

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12)
    const user = await prisma.user.upsert({
        where: { email: 'user@nexblog.com' },
        update: {},
        create: {
            email: 'user@nexblog.com',
            name: 'Regular User',
            password: userPassword,
            role: 'USER',
        },
    })

    // Create some tags
    const tags = await Promise.all([
        prisma.tag.upsert({
            where: { name: 'feature' },
            update: {},
            create: { name: 'feature', color: '#3b82f6' },
        }),
        prisma.tag.upsert({
            where: { name: 'bugfix' },
            update: {},
            create: { name: 'bugfix', color: '#ef4444' },
        }),
        prisma.tag.upsert({
            where: { name: 'improvement' },
            update: {},
            create: { name: 'improvement', color: '#10b981' },
        }),
        prisma.tag.upsert({
            where: { name: 'security' },
            update: {},
            create: { name: 'security', color: '#f59e0b' },
        }),
    ])

    // Create some sample posts
    const posts = await Promise.all([
        prisma.post.create({
            data: {
                title: 'Welcome to NexBlog!',
                content: 'We\'re excited to announce the launch of NexBlog, a modern micro-blog platform built with Next.js and Prisma. This platform provides a clean, fast, and secure way to share updates and changelogs.',
                authorId: admin.id,
                published: true,
                tags: {
                    create: [
                        { tagId: tags[0].id }, // feature
                        { tagId: tags[2].id }, // improvement
                    ],
                },
            },
        }),
        prisma.post.create({
            data: {
                title: 'Enhanced Security Features',
                content: 'We\'ve implemented two-factor authentication and improved data encryption to ensure your data remains secure. These changes provide an additional layer of protection for all users.',
                authorId: admin.id,
                published: true,
                tags: {
                    create: [
                        { tagId: tags[3].id }, // security
                        { tagId: tags[2].id }, // improvement
                    ],
                },
            },
        }),
        prisma.post.create({
            data: {
                title: 'Bug Fix: Login Issues Resolved',
                content: 'We\'ve identified and fixed a bug that was causing login failures for some users. The issue has been resolved and all users should now be able to sign in without problems.',
                authorId: user.id,
                published: true,
                tags: {
                    create: [
                        { tagId: tags[1].id }, // bugfix
                    ],
                },
            },
        }),
    ])

    // Create some likes
    await Promise.all([
        prisma.like.create({
            data: {
                userId: user.id,
                postId: posts[0].id,
            },
        }),
        prisma.like.create({
            data: {
                userId: admin.id,
                postId: posts[2].id,
            },
        }),
    ])

    // Create some comments
    await Promise.all([
        prisma.comment.create({
            data: {
                content: 'This looks amazing! Great work on the platform.',
                authorId: user.id,
                postId: posts[0].id,
            },
        }),
        prisma.comment.create({
            data: {
                content: 'The security improvements are much appreciated.',
                authorId: user.id,
                postId: posts[1].id,
            },
        }),
    ])

    // Create some notifications
    await Promise.all([
        prisma.notification.create({
            data: {
                type: 'LIKE',
                title: 'Someone liked your post',
                message: 'Regular User liked your post "Welcome to NexBlog!"',
                userId: admin.id,
                postId: posts[0].id,
            },
        }),
        prisma.notification.create({
            data: {
                type: 'COMMENT',
                title: 'New comment on your post',
                message: 'Regular User commented on your post "Welcome to NexBlog!"',
                userId: admin.id,
                postId: posts[0].id,
            },
        }),
    ])

    console.log('✅ Database seeded successfully!')
    console.log('📧 Admin email: admin@nexblog.com')
    console.log('🔑 Admin password: admin123')
    console.log('📧 User email: user@nexblog.com')
    console.log('🔑 User password: user123')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 