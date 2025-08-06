const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function createTestUser() {
    try {
        console.log('👤 Creating test user for email/password login...');

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

createTestUser().catch(console.error); 