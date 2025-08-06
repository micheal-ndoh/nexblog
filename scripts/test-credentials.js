const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function testCredentialsProvider() {
    try {
        console.log('🔐 Testing Credentials Provider...\n');

        // Get a user with a password
        const users = await prisma.user.findMany({
            where: {
                password: {
                    not: null
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true
            }
        });

        console.log(`📊 Found ${users.length} users with passwords:`);
        users.forEach(user => {
            console.log(`  - ${user.email} (${user.name}) - Role: ${user.role}`);
        });

        if (users.length === 0) {
            console.log('\n⚠️  No users with passwords found!');
            console.log('💡 This means all users were created via OAuth and cannot sign in with email/password.');
            console.log('💡 To test email/password login, you need to create a user with a password.');
            return false;
        }

        // Test with the first user that has a password
        const testUser = users[0];
        console.log(`\n🧪 Testing with user: ${testUser.email}`);

        // Test password verification
        const testPassword = 'password123'; // You might need to adjust this
        const isValid = await bcrypt.compare(testPassword, testUser.password);
        console.log(`Password verification result: ${isValid}`);

        if (!isValid) {
            console.log('❌ Password verification failed');
            console.log('💡 The user might have been created via OAuth or has a different password');
            console.log('💡 Try creating a new user with email/password or use OAuth login');
        } else {
            console.log('✅ Password verification successful');
        }

        return true;
    } catch (error) {
        console.error('❌ Credentials test failed:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

async function createTestUser() {
    try {
        console.log('\n👤 Creating test user for email/password login...');

        const testEmail = 'test@nexblog.com';
        const testPassword = 'testpassword123';
        const hashedPassword = await bcrypt.hash(testPassword, 10);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: testEmail }
        });

        if (existingUser) {
            console.log('⚠️  Test user already exists, updating password...');
            await prisma.user.update({
                where: { email: testEmail },
                data: { password: hashedPassword }
            });
        } else {
            console.log('✅ Creating new test user...');
            await prisma.user.create({
                data: {
                    email: testEmail,
                    name: 'Test User',
                    password: hashedPassword,
                    role: 'USER'
                }
            });
        }

        console.log('✅ Test user created/updated successfully!');
        console.log(`📧 Email: ${testEmail}`);
        console.log(`🔑 Password: ${testPassword}`);
        console.log('\n💡 You can now test email/password login with these credentials');

        return true;
    } catch (error) {
        console.error('❌ Failed to create test user:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

async function main() {
    console.log('🧪 Credentials Provider Test\n');

    const credentialsSuccess = await testCredentialsProvider();

    if (!credentialsSuccess) {
        console.log('\n🛠️  Creating test user for email/password login...');
        await createTestUser();
    }

    console.log('\n📊 Test Summary:');
    console.log(`Credentials Provider: ${credentialsSuccess ? '✅ PASS' : '❌ FAIL'}`);

    if (!credentialsSuccess) {
        console.log('\n💡 Next Steps:');
        console.log('1. Try logging in with the test user credentials');
        console.log('2. Or use Google OAuth login');
        console.log('3. Check the NextAuth configuration in src/lib/auth.ts');
    }
}

main().catch(console.error); 
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function testCredentialsProvider() {
    try {
        console.log('🔐 Testing Credentials Provider...\n');

        // Get a user with a password
        const users = await prisma.user.findMany({
            where: {
                password: {
                    not: null
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true
            }
        });

        console.log(`📊 Found ${users.length} users with passwords:`);
        users.forEach(user => {
            console.log(`  - ${user.email} (${user.name}) - Role: ${user.role}`);
        });

        if (users.length === 0) {
            console.log('\n⚠️  No users with passwords found!');
            console.log('💡 This means all users were created via OAuth and cannot sign in with email/password.');
            console.log('💡 To test email/password login, you need to create a user with a password.');
            return false;
        }

        // Test with the first user that has a password
        const testUser = users[0];
        console.log(`\n🧪 Testing with user: ${testUser.email}`);

        // Test password verification
        const testPassword = 'password123'; // You might need to adjust this
        const isValid = await bcrypt.compare(testPassword, testUser.password);
        console.log(`Password verification result: ${isValid}`);

        if (!isValid) {
            console.log('❌ Password verification failed');
            console.log('💡 The user might have been created via OAuth or has a different password');
            console.log('💡 Try creating a new user with email/password or use OAuth login');
        } else {
            console.log('✅ Password verification successful');
        }

        return true;
    } catch (error) {
        console.error('❌ Credentials test failed:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

async function createTestUser() {
    try {
        console.log('\n👤 Creating test user for email/password login...');

        const testEmail = 'test@nexblog.com';
        const testPassword = 'testpassword123';
        const hashedPassword = await bcrypt.hash(testPassword, 10);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: testEmail }
        });

        if (existingUser) {
            console.log('⚠️  Test user already exists, updating password...');
            await prisma.user.update({
                where: { email: testEmail },
                data: { password: hashedPassword }
            });
        } else {
            console.log('✅ Creating new test user...');
            await prisma.user.create({
                data: {
                    email: testEmail,
                    name: 'Test User',
                    password: hashedPassword,
                    role: 'USER'
                }
            });
        }

        console.log('✅ Test user created/updated successfully!');
        console.log(`📧 Email: ${testEmail}`);
        console.log(`🔑 Password: ${testPassword}`);
        console.log('\n💡 You can now test email/password login with these credentials');

        return true;
    } catch (error) {
        console.error('❌ Failed to create test user:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

async function main() {
    console.log('🧪 Credentials Provider Test\n');

    const credentialsSuccess = await testCredentialsProvider();

    if (!credentialsSuccess) {
        console.log('\n🛠️  Creating test user for email/password login...');
        await createTestUser();
    }

    console.log('\n📊 Test Summary:');
    console.log(`Credentials Provider: ${credentialsSuccess ? '✅ PASS' : '❌ FAIL'}`);

    if (!credentialsSuccess) {
        console.log('\n💡 Next Steps:');
        console.log('1. Try logging in with the test user credentials');
        console.log('2. Or use Google OAuth login');
        console.log('3. Check the NextAuth configuration in src/lib/auth.ts');
    }
}

main().catch(console.error); 
 