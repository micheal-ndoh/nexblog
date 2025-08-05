#!/usr/bin/env node

const https = require('https');
const http = require('http');

console.log('🔍 Checking Google OAuth Configuration...\n');

// Check environment variables
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
];

console.log('📋 Environment Variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('SECRET') ? '***' : value}`);
  } else {
    console.log(`❌ ${varName}: Not set`);
  }
});

console.log('\n🌐 NextAuth Configuration:');
console.log(`Base URL: ${process.env.NEXTAUTH_URL || 'Not set'}`);
console.log(`Callback URL: ${process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google` : 'Not set'}`);

console.log('\n📝 Google Cloud Console Configuration Required:');
console.log('1. Go to https://console.cloud.google.com/');
console.log('2. Select your project');
console.log('3. Go to APIs & Services > Credentials');
console.log('4. Edit your OAuth 2.0 Client ID');
console.log('5. Add these Authorized redirect URIs:');
console.log(`   - ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`);
console.log('6. Add these Authorized JavaScript origins:');
console.log(`   - ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}`);

console.log('\n🔧 Troubleshooting Steps:');
console.log('1. Ensure your Google OAuth client is configured for Web application');
console.log('2. Verify the redirect URI matches exactly (including protocol and port)');
console.log('3. Make sure your app is running on the correct port');
console.log('4. Check that NEXTAUTH_URL matches your actual app URL');

// Test if the callback URL is accessible
const testCallbackUrl = () => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const callbackUrl = `${baseUrl}/api/auth/callback/google`;
  
  console.log(`\n🧪 Testing callback URL: ${callbackUrl}`);
  
  const url = new URL(callbackUrl);
  const client = url.protocol === 'https:' ? https : http;
  
  const req = client.get(url, (res) => {
    console.log(`Status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('✅ Callback URL is accessible');
    } else {
      console.log('⚠️  Callback URL returned non-200 status');
    }
  });
  
  req.on('error', (err) => {
    console.log(`❌ Error accessing callback URL: ${err.message}`);
    console.log('💡 Make sure your development server is running');
  });
  
  req.setTimeout(5000, () => {
    console.log('⏰ Timeout accessing callback URL');
    req.destroy();
  });
};

// Only test if we have a base URL
if (process.env.NEXTAUTH_URL || process.env.NODE_ENV === 'development') {
  testCallbackUrl();
} 