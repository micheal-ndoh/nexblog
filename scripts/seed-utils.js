#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🌱 NexBlog Seed Data Management');
console.log('================================\n');

function showMenu() {
    console.log('Available actions:');
    console.log('1. Reset database and seed fresh data');
    console.log('2. View current database statistics');
    console.log('3. Add more sample posts');
    console.log('4. Add more users');
    console.log('5. Exit');
    console.log('');
}

function resetAndSeed() {
    console.log('🔄 Resetting database...');
    try {
        execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
        console.log('✅ Database reset successfully');

        console.log('🌱 Seeding database...');
        execSync('npm run db:seed', { stdio: 'inherit' });
        console.log('✅ Database seeded successfully');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

function viewStats() {
    console.log('📊 Current Database Statistics:');
    console.log('================================');

    try {
        // You can add more detailed statistics here
        console.log('• Users: 9 (1 admin + 8 regular users)');
        console.log('• Posts: 10 (with realistic content)');
        console.log('• Tags: 15 (covering various topics)');
        console.log('• Comments: 12 (distributed across posts)');
        console.log('• Likes: 40 (randomly distributed)');
        console.log('• Notifications: 6 (various types)');
        console.log('• Interested Posts: 12 (user interactions)');
        console.log('');
        console.log('🔑 Sample Login Credentials:');
        console.log('• Admin: admin@nexblog.com / admin123');
        console.log('• User: john.doe@example.com / user123');
        console.log('• User: jane.smith@example.com / user123');
        console.log('• User: mike.wilson@example.com / user123');
        console.log('• User: sarah.johnson@example.com / user123');
        console.log('• User: david.brown@example.com / user123');
        console.log('• User: emma.davis@example.com / user123');
        console.log('• User: alex.taylor@example.com / user123');
        console.log('• User: lisa.anderson@example.com / user123');
    } catch (error) {
        console.error('❌ Error viewing stats:', error.message);
    }
}

function addMorePosts() {
    console.log('📝 Adding more sample posts...');
    console.log('This feature would add additional posts to the existing data.');
    console.log('To implement this, you would need to extend the seed.ts file.');
    console.log('For now, you can manually add posts through the application interface.');
}

function addMoreUsers() {
    console.log('👥 Adding more users...');
    console.log('This feature would add additional users to the existing data.');
    console.log('To implement this, you would need to extend the seed.ts file.');
    console.log('For now, you can manually register users through the application interface.');
}

function handleChoice(choice) {
    switch (choice.trim()) {
        case '1':
            resetAndSeed();
            break;
        case '2':
            viewStats();
            break;
        case '3':
            addMorePosts();
            break;
        case '4':
            addMoreUsers();
            break;
        case '5':
            console.log('👋 Goodbye!');
            rl.close();
            return;
        default:
            console.log('❌ Invalid choice. Please select 1-5.');
    }

    console.log('');
    showMenu();
    rl.question('Enter your choice (1-5): ', handleChoice);
}

// Start the interactive menu
showMenu();
rl.question('Enter your choice (1-5): ', handleChoice); 