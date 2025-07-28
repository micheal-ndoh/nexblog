# NexBlog - Modern Micro-Blog Platform

A modern, performant, and secure full-stack micro-blog/changelog web application built with Next.js, Prisma, and NextAuth.js.

## 🚀 Features

### For Users
- **Authentication**: Email/password and Google OAuth login
- **Public Feed**: View and interact with micro-posts
- **Post Interactions**: Like, comment, and mark posts as "Interested"
- **Real-time Notifications**: Email notifications for post updates
- **Multi-language Support**: Internationalization with Tolgee
- **Responsive Design**: Mobile-first, modern UI with DaisyUI components
- **Dark/Light Mode**: Theme switching with system preference detection

### For Admins
- **Admin Dashboard**: User management, post management, and analytics
- **User Management**: Ban/unban users, promote to admin, delete accounts
- **Post Management**: Create, edit, delete, and moderate posts
- **Analytics**: View user engagement and platform statistics

### Technical Features
- **Performance**: Static generation (SSG) for public content
- **Security**: NextAuth.js with JWT sessions
- **Database**: MySQL with Prisma ORM
- **Styling**: TailwindCSS + DaisyUI with custom design system
- **State Management**: Zustand for client-side state
- **Email**: Resend for transactional emails
- **Internationalization**: Tolgee for i18n with in-context editing

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js v4
- **Styling**: TailwindCSS + DaisyUI
- **State Management**: Zustand
- **Internationalization**: Tolgee
- **Email Service**: Resend
- **Deployment**: Vercel (recommended)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MySQL database
- Google OAuth credentials (optional)
- Tolgee account (optional)
- Resend account (optional)

### 1. Clone the repository
```bash
git clone <repository-url>
cd nexblog
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy the example environment file and configure your variables:
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/nexblog"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Tolgee (optional)
NEXT_PUBLIC_TOLGEE_API_KEY="your-tolgee-api-key"
NEXT_PUBLIC_TOLGEE_API_URL="https://app.tolgee.io"

# Resend (optional)
RESEND_API_KEY="your-resend-api-key"
```

### 4. Set up the database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Schema

The application uses the following main models:

- **User**: Authentication and user profiles
- **Post**: Micro-blog posts with tags
- **Comment**: User comments on posts
- **Like**: Post likes by users
- **Tag**: Categorization system
- **Notification**: User notifications
- **InterestedPost**: Users marking posts as interested

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

### Tolgee Setup (Optional)
1. Create account at [Tolgee](https://app.tolgee.io/)
2. Create a new project
3. Get your API key
4. Add to `.env.local`

### Resend Setup (Optional)
1. Create account at [Resend](https://resend.com/)
2. Get your API key
3. Add to `.env.local`

## 📱 Usage

### Creating Posts
1. Sign in to your account
2. Click "New Post" in the header
3. Write your post content
4. Add tags for categorization
5. Publish your post

### Admin Features
1. Sign in with an admin account
2. Access admin dashboard via user menu
3. Manage users, posts, and view analytics

### Notifications
- Users receive email notifications for:
  - New comments on their posts
  - Likes on their posts
  - Updates on posts they're interested in

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security Features

- **Authentication**: Secure session management with NextAuth.js
- **Authorization**: Role-based access control (User/Admin)
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: NextAuth.js CSRF tokens

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update DaisyUI theme in the config
- Customize components in `src/components/`

### Internationalization
- Add new languages in `src/lib/tolgee.ts`
- Create translation files in Tolgee dashboard
- Use `useT()` hook for translations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Updates

Stay updated with the latest features and security patches by:
- Following the repository
- Checking the releases page
- Reading the changelog

---

Built with ❤️ using Next.js, Prisma, and modern web technologies.
