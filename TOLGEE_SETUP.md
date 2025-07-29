# Tolgee Translation Setup Guide

This guide will help you set up and use Tolgee for managing translations in your NexBlog application.

## Prerequisites

1. A Tolgee account (sign up at [https://app.tolgee.io](https://app.tolgee.io))
2. Your Tolgee API key
3. Your Tolgee project ID (optional, will auto-detect)

## Environment Variables

Make sure you have these environment variables set in your `.env.local` file:

```bash
NEXT_PUBLIC_TOLGEE_API_KEY=tgpak_giydomrzl5zwgnzthbztmytbojstgm3nm5ugunzxgjudi5tnnzua
NEXT_PUBLIC_TOLGEE_API_URL=https://app.tolgee.io
# Optional: TOLGEE_PROJECT_ID=your-project-id
```

## Step-by-Step Setup

### 1. Create a Project in Tolgee

1. Go to [https://app.tolgee.io](https://app.tolgee.io)
2. Sign in to your account
3. Create a new project (or use an existing one)
4. Note down your project ID (you can find it in the project settings)

### 2. Export Translation Keys

Run the export command to upload all your English translation keys to Tolgee:

```bash
npm run tolgee:export
```

This will:
- Read all translation keys from `i18n/en.json`
- Create a namespace called "nexblog" in your Tolgee project
- Upload all keys with their English translations

### 3. Add Languages in Tolgee

1. Go to your Tolgee project dashboard
2. Navigate to "Languages" in the sidebar
3. Add the languages you want to support:
   - German (de)
   - Spanish (es)
   - French (fr)
   - French (Cameroon) (fr-CM)
   - English (Cameroon) (en-CM)
   - Hindi (hi)
   - Chinese (zh)

### 4. Translate Your Keys

1. In your Tolgee project, go to "Translations"
2. You'll see all your translation keys organized by namespace
3. Click on each key to translate it to your target languages
4. Use the translation memory and AI suggestions to speed up the process

### 5. Import Translated Keys

After you've translated your keys in Tolgee, import them back to your project:

```bash
npm run tolgee:import
```

This will:
- Download all translated keys from Tolgee
- Create language-specific JSON files in the `i18n/` directory
- Files will be named: `de.json`, `es.json`, `fr.json`, etc.

### 6. Verify Translations

Check that the translation files were created correctly:

```bash
ls -la i18n/
```

You should see files like:
- `en.json` (source)
- `de.json` (German translations)
- `es.json` (Spanish translations)
- `fr.json` (French translations)
- etc.

## Available Commands

### Export Keys to Tolgee
```bash
npm run tolgee:export
```

### Import Translations from Tolgee
```bash
npm run tolgee:import
```

### List Available Languages
```bash
npm run tolgee:languages
```

### Direct Script Usage
```bash
node scripts/tolgee-export.js export
node scripts/tolgee-export.js import
node scripts/tolgee-export.js languages
```

## Workflow

### Initial Setup
1. `npm run tolgee:export` - Upload keys to Tolgee
2. Add languages in Tolgee dashboard
3. Translate keys in Tolgee
4. `npm run tolgee:import` - Download translations

### Ongoing Translation Work
1. Add new keys to `i18n/en.json`
2. `npm run tolgee:export` - Upload new keys
3. Translate new keys in Tolgee
4. `npm run tolgee:import` - Download updated translations

## Troubleshooting

### API Key Issues
- Make sure your `NEXT_PUBLIC_TOLGEE_API_KEY` is correct
- Verify the API key has the necessary permissions

### Project ID Issues
- If you get project-related errors, set `TOLGEE_PROJECT_ID` in your environment
- Or let the script auto-detect your first project

### Network Issues
- Check your internet connection
- Verify the Tolgee API URL is accessible

### File Permission Issues
- Make sure the script is executable: `chmod +x scripts/tolgee-export.js`
- Ensure you have write permissions to the `i18n/` directory

## Translation Keys Structure

Your translation keys are organized by namespace and follow this pattern:

```
admin.*          - Admin dashboard related keys
auth.*           - Authentication related keys
comments.*       - Comment system keys
common.*         - Common UI elements
explore.*        - Explore page keys
general.*        - General application keys
header.*         - Header navigation keys
home.*           - Home page keys
nav.*            - Navigation keys
newPost.*        - New post creation keys
notifications.*  - Notification system keys
posts.*          - Post-related keys
search.*         - Search functionality keys
settings.*       - Settings page keys
signin.*         - Sign-in page keys
upload.*         - File upload keys
user.*           - User profile keys
```

## Best Practices

1. **Keep keys organized**: Use namespaces to group related translations
2. **Use descriptive keys**: Make keys self-explanatory
3. **Consistent naming**: Follow the established naming convention
4. **Regular updates**: Export and import regularly to keep translations in sync
5. **Backup**: Keep backups of your translation files
6. **Test**: Always test translations in your application after importing

## Support

If you encounter issues:

1. Check the console output for error messages
2. Verify your Tolgee project settings
3. Ensure all environment variables are set correctly
4. Check the Tolgee documentation: [https://tolgee.io/docs](https://tolgee.io/docs)

## Example Translation Workflow

```bash
# 1. Export current keys
npm run tolgee:export

# 2. Go to Tolgee and translate keys
# (Manual step in Tolgee dashboard)

# 3. Import translated keys
npm run tolgee:import

# 4. Restart your development server
npm run dev
```

Your application will now use the translated keys based on the user's language preference! 