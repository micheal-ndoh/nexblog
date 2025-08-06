#!/usr/bin/env node

require('dotenv').config();

const https = require('https');

// Test Google OAuth endpoints
const testEndpoints = [
    'https://accounts.google.com/.well-known/openid-configuration',
    'https://oauth2.googleapis.com/token',
    'https://www.googleapis.com/oauth2/v1/userinfo'
];

async function testEndpoint(url) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            console.log(`✅ ${url} - Status: ${res.statusCode}`);
            resolve({ url, status: res.statusCode, success: res.statusCode === 200 });
        });

        req.on('error', (err) => {
            console.log(`❌ ${url} - Error: ${err.message}`);
            resolve({ url, error: err.message, success: false });
        });

        req.setTimeout(10000, () => {
            console.log(`⏰ ${url} - Timeout after 10 seconds`);
            req.destroy();
            resolve({ url, error: 'Timeout', success: false });
        });
    });
}

async function runTests() {
    console.log('🔍 Testing Google OAuth connectivity...\n');

    const results = await Promise.all(testEndpoints.map(testEndpoint));

    console.log('\n📊 Results:');
    const successful = results.filter(r => r.success).length;
    const total = results.length;

    console.log(`✅ Successful: ${successful}/${total}`);

    if (successful === total) {
        console.log('🎉 All Google OAuth endpoints are accessible!');
    } else {
        console.log('⚠️  Some endpoints are not accessible. This might be a network issue.');
        console.log('\n💡 Troubleshooting tips:');
        console.log('1. Check your internet connection');
        console.log('2. Try using a VPN if you\'re in a restricted region');
        console.log('3. Check if your firewall is blocking Google services');
        console.log('4. Verify your Google OAuth credentials in .env file');
    }
}

runTests().catch(console.error); 