#!/usr/bin/env node

require('dotenv').config();

const https = require('https');
const http = require('http');

console.log('🧪 Testing Google OAuth Configuration...\n');

// Load environment variables
const envVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
};

console.log('📋 Environment Variables Check:');
Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
        console.log(`✅ ${key}: ${key.includes('SECRET') ? '***' : value}`);
    } else {
        console.log(`❌ ${key}: Not set`);
    }
});

console.log('\n🔗 OAuth URLs:');
const baseUrl = envVars.NEXTAUTH_URL || 'http://localhost:3000';
const callbackUrl = `${baseUrl}/api/auth/callback/google`;
const signInUrl = `${baseUrl}/api/auth/signin/google`;

console.log(`Base URL: ${baseUrl}`);
console.log(`Callback URL: ${callbackUrl}`);
console.log(`Sign-in URL: ${signInUrl}`);

// Test if the server is running
const testServer = (url, description) => {
    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;

        const req = client.get(urlObj, (res) => {
            console.log(`${description}: ${res.statusCode}`);
            resolve(res.statusCode);
        });

        req.on('error', (err) => {
            console.log(`${description}: Error - ${err.message}`);
            resolve('error');
        });

        req.setTimeout(3000, () => {
            console.log(`${description}: Timeout`);
            req.destroy();
            resolve('timeout');
        });
    });
};

console.log('\n🌐 Server Tests:');
Promise.all([
    testServer(baseUrl, 'Base URL'),
    testServer(callbackUrl, 'Callback URL'),
    testServer(signInUrl, 'Sign-in URL')
]).then((results) => {
    console.log('\n📊 Results Summary:');
    console.log(`Base URL: ${results[0] === 200 ? '✅ OK' : '❌ Failed'}`);
    console.log(`Callback URL: ${results[1] === 400 ? '⚠️  Expected 400 (no params)' : results[1] === 200 ? '✅ OK' : '❌ Failed'}`);
    console.log(`Sign-in URL: ${results[2] === 200 ? '✅ OK' : '❌ Failed'}`);

    console.log('\n🔧 Next Steps:');
    if (results[0] !== 200) {
        console.log('1. Start your development server: npm run dev');
    }
    if (results[1] === 400) {
        console.log('2. The callback URL is working (400 is expected without OAuth parameters)');
    }
    console.log('3. Verify Google Cloud Console configuration:');
    console.log('   - Go to https://console.cloud.google.com/');
    console.log('   - Navigate to APIs & Services > Credentials');
    console.log('   - Edit your OAuth 2.0 Client ID');
    console.log('   - Add redirect URI: ' + callbackUrl);
    console.log('   - Add JavaScript origin: ' + baseUrl);
}); 