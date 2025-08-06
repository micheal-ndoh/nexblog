const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function testDatabaseConnection() {
    try {
        console.log('🔍 Testing database connection...');

        // Test basic connection
        await prisma.$connect();
        console.log('✅ Database connection successful');

        // Test user count
        const userCount = await prisma.user.count();
        console.log(`📊 Total users in database: ${userCount}`);

        // List all users (without passwords)
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            }
        });

        console.log('👥 Users in database:');
        users.forEach(user => {
            console.log(`  - ${user.email} (${user.name}) - Role: ${user.role}`);
        });

        // Test session count
        const sessionCount = await prisma.session.count();
        console.log(`🔐 Active sessions: ${sessionCount}`);

        // Test account count
        const accountCount = await prisma.account.count();
        console.log(`🔗 OAuth accounts: ${accountCount}`);

        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

async function testUserAuthentication() {
    try {
        console.log('\n🔐 Testing user authentication...');

        // Test with a sample email
        const testEmail = 'test@example.com';
        const user = await prisma.user.findUnique({
            where: { email: testEmail }
        });

        if (user) {
            console.log(`✅ User found: ${user.email}`);
            console.log(`   Has password: ${!!user.password}`);
            console.log(`   Role: ${user.role}`);
        } else {
            console.log(`⚠️  No user found with email: ${testEmail}`);
        }

        // Test password hashing
        const testPassword = 'testpassword123';
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        console.log('✅ Password hashing works');

        const isValid = await bcrypt.compare(testPassword, hashedPassword);
        console.log(`✅ Password verification works: ${isValid}`);

        return true;
    } catch (error) {
        console.error('❌ Authentication test failed:', error);
        return false;
    }
}

async function main() {
    console.log('🧪 Database and Authentication Test\n');

    const dbSuccess = await testDatabaseConnection();
    const authSuccess = await testUserAuthentication();

    console.log('\n📊 Test Results:');
    console.log(`Database Connection: ${dbSuccess ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Authentication: ${authSuccess ? '✅ PASS' : '❌ FAIL'}`);

    if (!dbSuccess) {
        console.log('\n💡 Troubleshooting tips:');
        console.log('1. Check your DATABASE_URL in .env file');
        console.log('2. Verify Railway database is running');
        console.log('3. Check network connectivity to Railway');
        console.log('4. Run: npx prisma generate && npx prisma db push');
    }

    if (!authSuccess) {
        console.log('\n💡 Authentication issues:');
        console.log('1. Check if users exist in database');
        console.log('2. Verify password hashing is working');
        console.log('3. Check NextAuth configuration');
    }
}

main().catch(console.error); 