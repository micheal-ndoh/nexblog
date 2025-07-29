#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if it exists
try {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').replace(/^["']|["']$/g, '');
                process.env[key.trim()] = value.trim();
            }
        });
    }
} catch (error) {
    console.warn('Could not load .env.local file:', error.message);
}

// Tolgee API configuration
const TOLGEE_API_URL = process.env.NEXT_PUBLIC_TOLGEE_API_URL || 'https://app.tolgee.io';
const TOLGEE_API_KEY = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;

// Project configuration
const PROJECT_ID = process.env.TOLGEE_PROJECT_ID; // You'll need to get this from your Tolgee dashboard
const NAMESPACE = 'nexblog'; // Namespace for your translations

// File paths
const EN_JSON_PATH = path.join(__dirname, '../i18n/en.json');
const OUTPUT_DIR = path.join(__dirname, '../i18n');

async function makeTolgeeRequest(endpoint, options = {}) {
    const url = `${TOLGEE_API_URL}/v2${endpoint}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${TOLGEE_API_KEY}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Tolgee API error: ${response.status} - ${error}`);
    }

    return response.json();
}

async function getProjectId() {
    if (PROJECT_ID) {
        return PROJECT_ID;
    }

    try {
        const projects = await makeTolgeeRequest('/projects');
        if (projects.length === 0) {
            throw new Error('No projects found. Please create a project in Tolgee first.');
        }

        console.log('Available projects:');
        projects.forEach(project => {
            console.log(`- ${project.name} (ID: ${project.id})`);
        });

        return projects[0].id; // Use the first project
    } catch (error) {
        console.error('Error fetching projects:', error.message);
        process.exit(1);
    }
}

async function exportToTolgee() {
    console.log('🚀 Starting export to Tolgee...');

    if (!TOLGEE_API_KEY) {
        console.error('❌ NEXT_PUBLIC_TOLGEE_API_KEY is not set in environment variables');
        process.exit(1);
    }

    try {
        // Read the English translations
        const enTranslations = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf8'));
        const projectId = await getProjectId();

        console.log(`📁 Project ID: ${projectId}`);
        console.log(`📊 Found ${Object.keys(enTranslations).length} translation keys`);

        // Create namespace if it doesn't exist
        try {
            await makeTolgeeRequest(`/projects/${projectId}/namespaces`, {
                method: 'POST',
                body: JSON.stringify({
                    name: NAMESPACE,
                }),
            });
            console.log(`✅ Created namespace: ${NAMESPACE}`);
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log(`ℹ️  Namespace ${NAMESPACE} already exists`);
            } else {
                console.log(`⚠️  Could not create namespace: ${error.message}`);
            }
        }

        // Export keys to Tolgee
        const keys = Object.entries(enTranslations).map(([key, value]) => ({
            name: key,
            translations: {
                en: value,
            },
            namespace: NAMESPACE,
        }));

        console.log('📤 Uploading translation keys to Tolgee...');

        for (const key of keys) {
            try {
                await makeTolgeeRequest(`/projects/${projectId}/keys`, {
                    method: 'POST',
                    body: JSON.stringify(key),
                });
                console.log(`✅ Uploaded: ${key.name}`);
            } catch (error) {
                if (error.message.includes('already exists')) {
                    console.log(`ℹ️  Key already exists: ${key.name}`);
                } else {
                    console.log(`❌ Failed to upload ${key.name}: ${error.message}`);
                }
            }
        }

        console.log('🎉 Export completed successfully!');
        console.log(`📝 Go to ${TOLGEE_API_URL}/projects/${projectId} to translate your keys`);

    } catch (error) {
        console.error('❌ Export failed:', error.message);
        process.exit(1);
    }
}

async function importFromTolgee() {
    console.log('📥 Starting import from Tolgee...');

    if (!TOLGEE_API_KEY) {
        console.error('❌ NEXT_PUBLIC_TOLGEE_API_KEY is not set in environment variables');
        process.exit(1);
    }

    try {
        const projectId = await getProjectId();

        // Get all languages
        const languages = await makeTolgeeRequest(`/projects/${projectId}/languages`);
        console.log(`🌍 Found ${languages.length} languages:`, languages.map(l => l.tag).join(', '));

        // Import translations for each language
        for (const language of languages) {
            if (language.tag === 'en') continue; // Skip English as it's our source

            console.log(`📥 Importing ${language.tag} translations...`);

            try {
                const translations = await makeTolgeeRequest(
                    `/projects/${projectId}/translations/${language.tag}?namespace=${NAMESPACE}`
                );

                if (translations.length > 0) {
                    const translationMap = {};
                    translations.forEach(t => {
                        if (t.key && t.text) {
                            translationMap[t.key] = t.text;
                        }
                    });

                    const outputPath = path.join(OUTPUT_DIR, `${language.tag}.json`);
                    fs.writeFileSync(outputPath, JSON.stringify(translationMap, null, 2));
                    console.log(`✅ Imported ${Object.keys(translationMap).length} translations for ${language.tag}`);
                } else {
                    console.log(`⚠️  No translations found for ${language.tag}`);
                }
            } catch (error) {
                console.log(`❌ Failed to import ${language.tag}: ${error.message}`);
            }
        }

        console.log('🎉 Import completed successfully!');

    } catch (error) {
        console.error('❌ Import failed:', error.message);
        process.exit(1);
    }
}

async function listLanguages() {
    console.log('🌍 Fetching available languages from Tolgee...');

    if (!TOLGEE_API_KEY) {
        console.error('❌ NEXT_PUBLIC_TOLGEE_API_KEY is not set in environment variables');
        process.exit(1);
    }

    try {
        const projectId = await getProjectId();
        const languages = await makeTolgeeRequest(`/projects/${projectId}/languages`);

        console.log('\n📋 Available languages:');
        languages.forEach(lang => {
            console.log(`- ${lang.tag} (${lang.name})`);
        });

    } catch (error) {
        console.error('❌ Failed to fetch languages:', error.message);
        process.exit(1);
    }
}

// CLI commands
const command = process.argv[2];

switch (command) {
    case 'export':
        exportToTolgee();
        break;
    case 'import':
        importFromTolgee();
        break;
    case 'languages':
        listLanguages();
        break;
    default:
        console.log(`
🌐 Tolgee Translation Manager

Usage:
  node scripts/tolgee-export.js <command>

Commands:
  export     Export translation keys from en.json to Tolgee
  import     Import translated keys from Tolgee to language files
  languages  List available languages in Tolgee

Environment Variables:
  NEXT_PUBLIC_TOLGEE_API_KEY    Your Tolgee API key
  NEXT_PUBLIC_TOLGEE_API_URL    Tolgee API URL (default: https://app.tolgee.io)
  TOLGEE_PROJECT_ID            Your Tolgee project ID (optional, will auto-detect)

Example:
  node scripts/tolgee-export.js export
  node scripts/tolgee-export.js import
        `);
        break;
} 