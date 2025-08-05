import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database with comprehensive data...')

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
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        },
    })

    // Create multiple regular users with realistic data
    const usersData = [
        {
            email: 'john.doe@example.com',
            name: 'John Doe',
            password: 'user123',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        },
        {
            email: 'jane.smith@example.com',
            name: 'Jane Smith',
            password: 'user123',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        },
        {
            email: 'mike.wilson@example.com',
            name: 'Mike Wilson',
            password: 'user123',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        },
        {
            email: 'sarah.johnson@example.com',
            name: 'Sarah Johnson',
            password: 'user123',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        },
        {
            email: 'david.brown@example.com',
            name: 'David Brown',
            password: 'user123',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        },
        {
            email: 'emma.davis@example.com',
            name: 'Emma Davis',
            password: 'user123',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        },
        {
            email: 'alex.taylor@example.com',
            name: 'Alex Taylor',
            password: 'user123',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        },
        {
            email: 'lisa.anderson@example.com',
            name: 'Lisa Anderson',
            password: 'user123',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        },
    ]

    const users = await Promise.all(
        usersData.map(async (userData) => {
            const hashedPassword = await bcrypt.hash(userData.password, 12)
            return prisma.user.upsert({
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
        })
    )

    // Create comprehensive tags
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

    const tags = await Promise.all(
        tagsData.map((tag) =>
            prisma.tag.upsert({
                where: { name: tag.name },
                update: {},
                create: { name: tag.name, color: tag.color },
            })
        )
    )

    // Create comprehensive posts with realistic content
    const postsData = [
        {
            title: 'Welcome to NexBlog - A Modern Micro-Blogging Platform',
            content: `We're excited to announce the launch of NexBlog, a modern micro-blogging platform built with Next.js 15, Prisma, and TypeScript. This platform provides a clean, fast, and secure way to share updates, changelogs, and thoughts.

Key features include:
• Real-time notifications
• Rich text editing with emoji support
• Tag-based categorization
• Like and comment system
• User profiles and settings
• Admin dashboard for content management

Built with modern web technologies and best practices, NexBlog offers a seamless experience for both content creators and readers.`,
            authorId: admin.id,
            tags: ['Technology', 'Next.js', 'Web Development'],
        },
        {
            title: 'Building Scalable APIs with Next.js 15',
            content: `Next.js 15 introduces several improvements for API development that make building scalable applications easier than ever.

The new App Router provides better performance and more intuitive routing patterns. Combined with Prisma for database operations, you can create robust APIs with minimal boilerplate code.

Key improvements:
• Enhanced middleware support
• Better error handling
• Improved TypeScript integration
• Optimized bundle splitting
• Server Actions for seamless client-server communication

This combination makes Next.js 15 an excellent choice for building modern web applications.`,
            authorId: users[0].id,
            tags: ['Programming', 'Next.js', 'API', 'Web Development'],
        },
        {
            title: 'TypeScript Best Practices for 2024',
            content: `TypeScript has evolved significantly over the years, and there are several best practices that can help you write more maintainable and type-safe code.

1. Use strict mode: Enable all strict type checking options
2. Leverage utility types: Use built-in utility types like Partial, Pick, and Omit
3. Prefer interfaces over types for object shapes
4. Use const assertions for immutable data
5. Implement proper error handling with Result types
6. Use branded types for domain-specific validation

These practices help catch errors at compile time and improve code quality.`,
            authorId: users[1].id,
            tags: ['TypeScript', 'Programming', 'Tips'],
        },
        {
            title: 'Database Design Patterns for Modern Applications',
            content: `Choosing the right database design patterns is crucial for building scalable applications. Here are some patterns that work well with Prisma and modern web applications.

1. Normalized vs Denormalized: Choose based on your query patterns
2. Soft deletes: Keep data integrity while allowing "deletion"
3. Audit trails: Track changes for compliance and debugging
4. Polymorphic associations: Handle different types of relationships
5. Optimistic concurrency control: Prevent data conflicts

These patterns help maintain data consistency and improve application performance.`,
            authorId: users[2].id,
            tags: ['Database', 'Programming', 'Tips'],
        },
        {
            title: 'React Performance Optimization Techniques',
            content: `Performance is crucial for providing a good user experience. Here are some React optimization techniques that can significantly improve your application's performance.

1. Use React.memo for expensive components
2. Implement proper key props in lists
3. Lazy load components and routes
4. Optimize bundle size with code splitting
5. Use useMemo and useCallback appropriately
6. Implement virtual scrolling for large lists

These optimizations can make your React applications feel much more responsive.`,
            authorId: users[3].id,
            tags: ['React', 'Programming', 'Performance', 'Tips'],
        },
        {
            title: 'The Future of Web Development: What to Expect in 2024',
            content: `Web development is evolving rapidly, and 2024 brings exciting new technologies and trends that will shape how we build applications.

Key trends to watch:
• Web Components gaining mainstream adoption
• Improved performance with WebAssembly
• Enhanced privacy features and regulations
• AI-powered development tools
• Progressive Web Apps becoming standard
• Enhanced accessibility requirements

Staying updated with these trends helps developers build better applications.`,
            authorId: users[4].id,
            tags: ['Web Development', 'Technology', 'Innovation', 'News'],
        },
        {
            title: 'Design Systems: Building Consistent User Interfaces',
            content: `A well-designed design system is the foundation of consistent and scalable user interfaces. Here's how to build and maintain an effective design system.

Components to include:
• Typography scale and hierarchy
• Color palette with semantic meanings
• Spacing and layout systems
• Interactive components (buttons, forms, etc.)
• Icon library and usage guidelines
• Animation and transition patterns

A good design system improves development speed and user experience.`,
            authorId: users[5].id,
            tags: ['Design', 'Web Development', 'Tips'],
        },
        {
            title: 'Productivity Tips for Developers',
            content: `Being productive as a developer isn't just about writing code faster. It's about working smarter and creating sustainable habits that improve your overall output.

Essential productivity practices:
• Use keyboard shortcuts effectively
• Implement proper project structure
• Automate repetitive tasks
• Use version control best practices
• Regular code reviews and refactoring
• Continuous learning and skill development

These practices help maintain high code quality while improving development speed.`,
            authorId: users[6].id,
            tags: ['Productivity', 'Tips', 'Programming'],
        },
        {
            title: 'Building Secure Web Applications',
            content: `Security should be a top priority when building web applications. Here are essential security practices that every developer should implement.

Security measures:
• Input validation and sanitization
• Proper authentication and authorization
• HTTPS everywhere
• Regular security updates
• SQL injection prevention
• XSS protection
• CSRF tokens
• Content Security Policy

Implementing these measures helps protect your users and your application.`,
            authorId: users[7].id,
            tags: ['Security', 'Web Development', 'Tips'],
        },
        {
            title: 'Microservices vs Monoliths: Choosing the Right Architecture',
            content: `The choice between microservices and monolithic architecture can significantly impact your application's scalability, maintainability, and development speed.

Microservices advantages:
• Independent deployment and scaling
• Technology diversity
• Fault isolation
• Team autonomy

Monolith advantages:
• Simpler development and deployment
• Easier debugging and testing
• Lower operational complexity
• Better performance for small applications

Choose based on your team size, application complexity, and business requirements.`,
            authorId: admin.id,
            tags: ['Architecture', 'Technology', 'Business'],
        },
    ]

    const posts = await Promise.all(
        postsData.map(async (postData) => {
            const tagIds = postData.tags.map(tagName =>
                tags.find(tag => tag.name === tagName)?.id
            ).filter(Boolean)

            return prisma.post.create({
                data: {
                    title: postData.title,
                    content: postData.content,
                    authorId: postData.authorId,
                    published: true,
                    tags: {
                        create: tagIds.map(tagId => ({ tagId: tagId! })),
                    },
                },
            })
        })
    )

    // Create likes for posts (random distribution)
    const likes = []
    for (const post of posts) {
        const numLikes = Math.floor(Math.random() * 8) + 1 // 1-8 likes per post
        const shuffledUsers = users.sort(() => 0.5 - Math.random())

        for (let i = 0; i < numLikes && i < shuffledUsers.length; i++) {
            likes.push({
                userId: shuffledUsers[i].id,
                postId: post.id,
            })
        }
    }

    await Promise.all(
        likes.map(like =>
            prisma.like.upsert({
                where: {
                    userId_postId: {
                        userId: like.userId,
                        postId: like.postId,
                    },
                },
                update: {},
                create: like,
            })
        )
    )

    // Create comments for posts
    const commentsData = [
        { content: 'This is exactly what I was looking for! Great work on the platform.', authorId: users[0].id, postId: posts[0].id },
        { content: 'The TypeScript integration looks really clean. Can\'t wait to try it out!', authorId: users[1].id, postId: posts[0].id },
        { content: 'These performance tips are gold. Already implemented some of them!', authorId: users[2].id, postId: posts[4].id },
        { content: 'The database patterns article is very helpful. Thanks for sharing!', authorId: users[3].id, postId: posts[3].id },
        { content: 'Security should always be a priority. Great reminder!', authorId: users[4].id, postId: posts[8].id },
        { content: 'Design systems are crucial for scaling. Love the practical approach here.', authorId: users[5].id, postId: posts[6].id },
        { content: 'Productivity tips are always welcome. These are really actionable!', authorId: users[6].id, postId: posts[7].id },
        { content: 'The microservices vs monoliths comparison is spot on.', authorId: users[7].id, postId: posts[9].id },
        { content: 'Next.js 15 features look promising. Excited to upgrade!', authorId: users[0].id, postId: posts[1].id },
        { content: 'TypeScript best practices article is comprehensive and well-written.', authorId: users[1].id, postId: posts[2].id },
        { content: 'Web development trends are changing so fast. Good to stay updated!', authorId: users[2].id, postId: posts[5].id },
        { content: 'React optimization techniques are essential for large applications.', authorId: users[3].id, postId: posts[4].id },
    ]

    await Promise.all(
        commentsData.map(comment =>
            prisma.comment.create({
                data: comment,
            })
        )
    )

    // Create notifications
    const notificationsData = [
        { type: 'LIKE', title: 'New like on your post', message: 'John Doe liked your post "Welcome to NexBlog"', userId: admin.id, postId: posts[0].id },
        { type: 'COMMENT', title: 'New comment on your post', message: 'Jane Smith commented on your post "Welcome to NexBlog"', userId: admin.id, postId: posts[0].id },
        { type: 'LIKE', title: 'New like on your post', message: 'Mike Wilson liked your post "TypeScript Best Practices"', userId: users[1].id, postId: posts[2].id },
        { type: 'COMMENT', title: 'New comment on your post', message: 'Sarah Johnson commented on your post "React Performance Optimization"', userId: users[3].id, postId: posts[4].id },
        { type: 'LIKE', title: 'New like on your post', message: 'David Brown liked your post "Database Design Patterns"', userId: users[2].id, postId: posts[3].id },
        { type: 'COMMENT', title: 'New comment on your post', message: 'Emma Davis commented on your post "Design Systems"', userId: users[5].id, postId: posts[6].id },
    ]

    await Promise.all(
        notificationsData.map(notification =>
            prisma.notification.create({
                data: notification,
            })
        )
    )

    // Create interested posts (users marking posts as interesting)
    const interestedPosts = []
    for (const post of posts.slice(0, 5)) { // First 5 posts
        const numInterested = Math.floor(Math.random() * 4) + 1 // 1-4 interested users
        const shuffledUsers = users.sort(() => 0.5 - Math.random())

        for (let i = 0; i < numInterested && i < shuffledUsers.length; i++) {
            interestedPosts.push({
                userId: shuffledUsers[i].id,
                postId: post.id,
            })
        }
    }

    await Promise.all(
        interestedPosts.map(interested =>
            prisma.interestedPost.upsert({
                where: {
                    userId_postId: {
                        userId: interested.userId,
                        postId: interested.postId,
                    },
                },
                update: {},
                create: interested,
            })
        )
    )

    console.log('✅ Database seeded successfully with comprehensive data!')
    console.log('📊 Created:')
    console.log(`   • ${users.length + 1} users (including admin)`)
    console.log(`   • ${tags.length} tags`)
    console.log(`   • ${posts.length} posts`)
    console.log(`   • ${likes.length} likes`)
    console.log(`   • ${commentsData.length} comments`)
    console.log(`   • ${notificationsData.length} notifications`)
    console.log(`   • ${interestedPosts.length} interested posts`)
    console.log('\n🔑 Login Credentials:')
    console.log('📧 Admin: admin@nexblog.com / admin123')
    console.log('📧 Users: user@nexblog.com / user123 (and others)')
    console.log('\n🎯 The seed data now provides a realistic blogging experience!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 