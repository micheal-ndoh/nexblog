"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAppStore } from './store'

// Language configuration for the application
export const languages = [
    { code: 'de', name: 'German | Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'en-CM', name: 'English (Cameroon)', flag: '🇨🇲' },
    { code: 'es', name: 'Spanish | español', flag: '🇪🇸' },
    { code: 'fr', name: 'French | français', flag: '🇫🇷' },
    { code: 'fr-CM', name: 'French (Cameroon) | français (Cameroun)', flag: '🇨🇲' },
    { code: 'hi', name: 'Hindi | हिन्दी', flag: '🇮🇳' },
    { code: 'zh', name: 'Chinese | 中文', flag: '🇨🇳' },
]

// Fallback English translations
const fallbackTranslations = {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.view': 'View',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.reset': 'Reset',

    // Navigation
    'nav.home': 'Home',
    'nav.explore': 'Explore',
    'nav.notifications': 'Notifications',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.signIn': 'Sign In',
    'nav.signUp': 'Sign Up',
    'nav.signOut': 'Sign Out',

    // Posts
    'posts.create': 'Create Post',
    'posts.edit': 'Edit Post',
    'posts.delete': 'Delete Post',
    'posts.title': 'Title',
    'posts.content': 'Content',
    'posts.publish': 'Publish',
    'posts.draft': 'Draft',
    'posts.published': 'Published',
    'posts.unpublished': 'Unpublished',
    'posts.likes': 'Likes',
    'posts.comments': 'Comments',
    'posts.shares': 'Shares',
    'posts.views': 'Views',
    'posts.tags': 'Tags',
    'posts.author': 'Author',
    'posts.createdAt': 'Created At',
    'posts.updatedAt': 'Updated At',
    'posts.noPosts': 'No Posts',
    'posts.noPostsMessage': 'No posts found',

    // Comments
    'comments.add': 'Add Comment',
    'comments.edit': 'Edit Comment',
    'comments.delete': 'Delete Comment',
    'comments.reply': 'Reply',
    'comments.placeholder': 'Write a comment...',
    'comments.noComments': 'No Comments',
    'comments.noCommentsMessage': 'No comments yet. Be the first to comment!',
    'comments.posting': 'Posting...',
    'comments.post': 'Post Comment',

    // User
    'user.profile': 'Profile',
    'user.settings': 'Settings',
    'user.posts': 'Posts',
    'user.followers': 'Followers',
    'user.following': 'Following',
    'user.memberSince': 'Member Since',
    'user.bio': 'Bio',
    'user.location': 'Location',
    'user.website': 'Website',
    'user.editProfile': 'Edit Profile',
    'user.changePassword': 'Change Password',
    'user.deleteAccount': 'Delete Account',

    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.signOut': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.name': 'Name',
    'auth.forgotPassword': 'Forgot Password',
    'auth.resetPassword': 'Reset Password',
    'auth.rememberMe': 'Remember Me',
    'auth.or': 'Or',
    'auth.withGoogle': 'Continue with Google',
    'auth.withEmail': 'Continue with Email',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.createAccount': 'Create Account',
    'auth.signInToAccount': 'Sign in to your account',
    'auth.welcomeBack': 'Welcome back',
    'auth.subtitle': 'Sign in to your account to continue',
    'auth.enterEmail': 'Enter your email',
    'auth.enterPassword': 'Enter your password',
    'auth.signingIn': 'Signing in...',
    'auth.orContinueWith': 'Or continue with',
    'auth.continueWithGoogle': 'Continue with Google',

    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAsRead': 'Mark as Read',
    'notifications.markAllAsRead': 'Mark All as Read',
    'notifications.noNotifications': 'No Notifications',
    'notifications.noNotificationsMessage': 'No notifications yet',
    'notifications.newLike': 'New Like',
    'notifications.newComment': 'New Comment',
    'notifications.newFollower': 'New Follower',
    'notifications.postUpdate': 'Post Update',

    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.users': 'Users',
    'admin.posts': 'Posts',
    'admin.analytics': 'Analytics',
    'admin.settings': 'Settings',
    'admin.banUser': 'Ban User',
    'admin.unbanUser': 'Unban User',
    'admin.deleteUser': 'Delete User',
    'admin.promoteToAdmin': 'Promote to Admin',
    'admin.demoteFromAdmin': 'Demote from Admin',
    'admin.approvePost': 'Approve Post',
    'admin.rejectPost': 'Reject Post',
    'admin.deletePost': 'Delete Post',
    'admin.manageUsers': 'Manage Users',
    'admin.managePosts': 'Manage Posts',
    'admin.totalUsers': 'Total Users',
    'admin.totalPosts': 'Total Posts',
    'admin.activeUsers': 'Active Users',
    'admin.bannedUsers': 'Banned Users',
    'admin.accessDenied': 'Access Denied',
    'admin.noPermission': "You don't have permission to access this page.",
    'admin.overview': 'Overview',
    'admin.quickActions': 'Quick Actions',
    'admin.manageUsersDesc': 'Ban, promote, or delete users',
    'admin.managePostsDesc': 'Approve, reject, or delete posts',
    'admin.viewAnalytics': 'View Analytics',
    'admin.viewAnalyticsDesc': 'See platform statistics and trends',
    'admin.activity': 'Activity',
    'admin.banned': 'Banned',
    'admin.active': 'Active',
    'admin.engagement': 'Engagement',
    'admin.engagementRate': 'Engagement Rate',
    'admin.postsPerUser': 'Posts per User',
    'admin.topUsers': 'Top Users',
    'admin.topPosts': 'Top Posts',
    'admin.error.fetchingData': 'Error fetching data',
    'admin.error.actionFailed': 'Action failed',

    // Settings
    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.security': 'Security',
    'settings.account': 'Account',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'System',

    // Errors
    'errors.notFound': 'Not Found',
    'errors.unauthorized': 'Unauthorized',
    'errors.forbidden': 'Forbidden',
    'errors.serverError': 'Server Error',
    'errors.networkError': 'Network Error',
    'errors.validationError': 'Validation Error',
    'errors.invalidCredentials': 'Invalid Credentials',
    'errors.emailAlreadyExists': 'Email Already Exists',
    'errors.weakPassword': 'Weak Password',
    'errors.invalidEmail': 'Invalid Email',

    // Home
    'home.latestUpdates': 'Latest Updates',
    'home.stayUpToDate': 'Stay up to date with the latest changes and announcements',

    // Explore
    'explore.title': 'Explore',
    'explore.subtitle': 'Discover trending content and viral posts',
    'explore.viral': 'Viral',
    'explore.trending': 'Trending',
    'explore.interested': 'Interested',
    'explore.latest': 'Latest',
    'explore.viralDescription': 'Most popular posts',
    'explore.trendingDescription': 'Rising in popularity',
    'explore.interestedDescription': 'Posts you might like',
    'explore.latestDescription': 'Fresh content',
    'explore.noViralPosts': 'No viral posts yet',
    'explore.noTrendingPosts': 'No trending posts yet',
    'explore.noInterestedPosts': 'No interested posts yet',
    'explore.noLatestPosts': 'No latest posts yet',
    'explore.checkBackLater': 'Check back later for trending content!',
    'explore.trendingTags': 'Trending Tags',
    'explore.topAuthors': 'Top Authors',
    'explore.platformStats': 'Platform Stats',
    'explore.totalPosts': 'Total Posts',
    'explore.activeUsers': 'Active Users',
    'explore.totalLikes': 'Total Likes',
    'explore.comments': 'Comments',

    // Header
    'header.nexblog': 'NexBlog',
    'header.newPost': 'New Post',
    'header.searchPlaceholder': 'Search by keywords or tags...',
    'header.toggleTheme': 'Toggle theme',
    'header.profile': 'Profile',
    'header.adminDashboard': 'Admin Dashboard',

    // File Upload
    'upload.invalidType': 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
    'upload.tooLarge': 'File too large. Maximum size is {maxSize}MB.',
    'upload.failed': 'Upload failed',
    'upload.mustBeLoggedIn': 'You must be logged in to upload files',
    'upload.uploading': 'Uploading...',
    'upload.profilePicture': 'Profile Picture',
    'upload.image': 'Image',

    // General
    'general.error': 'An error occurred',
    'general.unauthorized': 'Unauthorized',
    'general.internalServerError': 'Internal server error',
    'general.user': 'User',
    'general.actions': 'Actions',
    'general.title': 'Title',
    'general.status': 'Status',
    'general.role': 'Role',
    'general.email': 'Email',
    'general.createdAt': 'Created At',
    'general.updatedAt': 'Updated At',
} as const

interface TolgeeContextType {
    t: (key: string, params?: Record<string, unknown>) => string
    changeLanguage: (lang: string) => void
    getLanguage: () => string
    isLoading: boolean
}

const TolgeeContext = createContext<TolgeeContextType | null>(null)

export function TolgeeWrapper({ children }: { children: React.ReactNode }) {
    const { language, setLanguage } = useAppStore()
    const [isLoading, setIsLoading] = useState(false)
    const [translations, setTranslations] = useState<Record<string, string>>({})

    // Load translations based on language
    useEffect(() => {
        const loadTranslations = async () => {
            setIsLoading(true)
            try {
                // For now, we'll use fallback translations
                // In a real implementation, you would fetch from Tolgee API
                if (language === 'en') {
                    setTranslations(fallbackTranslations)
                } else {
                    // Try to load language-specific translations
                    try {
                        const response = await fetch(`/api/translations/${language}`)
                        if (response.ok) {
                            const data = await response.json()
                            setTranslations({ ...fallbackTranslations, ...data })
                        } else {
                            // Fallback to English if translation fails
                            setTranslations(fallbackTranslations)
                        }
                    } catch (error) {
                        console.warn(`Failed to load translations for ${language}, falling back to English`)
                        setTranslations(fallbackTranslations)
                    }
                }
            } catch (error) {
                console.error('Error loading translations:', error)
                setTranslations(fallbackTranslations)
            } finally {
                setIsLoading(false)
            }
        }

        loadTranslations()
    }, [language])

    const t = (key: string, params?: Record<string, unknown>): string => {
        let translation = translations[key] || fallbackTranslations[key as keyof typeof fallbackTranslations] || key

        // Replace parameters in translation
        if (params) {
            Object.entries(params).forEach(([param, value]) => {
                translation = translation.replace(new RegExp(`{${param}}`, 'g'), String(value))
            })
        }

        return translation
    }

    const changeLanguage = (lang: string) => {
        setLanguage(lang)
    }

    const getLanguage = () => language || 'en'

    const value: TolgeeContextType = {
        t,
        changeLanguage,
        getLanguage,
        isLoading,
    }

    return React.createElement(TolgeeContext.Provider, { value }, children)
}

export function useT() {
    const context = useContext(TolgeeContext)
    if (!context) {
        throw new Error('useT must be used within a TolgeeWrapper')
    }
    return context
}

// Translation keys for the application
export const translationKeys = {
    // Common
    common: {
        loading: 'common.loading',
        error: 'common.error',
        success: 'common.success',
        save: 'common.save',
        cancel: 'common.cancel',
        delete: 'common.delete',
        edit: 'common.edit',
        create: 'common.create',
        search: 'common.search',
        filter: 'common.filter',
        sort: 'common.sort',
        view: 'common.view',
        close: 'common.close',
        back: 'common.back',
        next: 'common.next',
        previous: 'common.previous',
        submit: 'common.submit',
        reset: 'common.reset',
    },

    // Navigation
    nav: {
        home: 'nav.home',
        explore: 'nav.explore',
        notifications: 'nav.notifications',
        settings: 'nav.settings',
        profile: 'nav.profile',
        admin: 'nav.admin',
        signIn: 'nav.signIn',
        signUp: 'nav.signUp',
        signOut: 'nav.signOut',
    },

    // Posts
    posts: {
        create: 'posts.create',
        edit: 'posts.edit',
        delete: 'posts.delete',
        title: 'posts.title',
        content: 'posts.content',
        publish: 'posts.publish',
        draft: 'posts.draft',
        published: 'posts.published',
        unpublished: 'posts.unpublished',
        likes: 'posts.likes',
        comments: 'posts.comments',
        shares: 'posts.shares',
        views: 'posts.views',
        tags: 'posts.tags',
        author: 'posts.author',
        createdAt: 'posts.createdAt',
        updatedAt: 'posts.updatedAt',
        noPosts: 'posts.noPosts',
        noPostsMessage: 'posts.noPostsMessage',
    },

    // Comments
    comments: {
        add: 'comments.add',
        edit: 'comments.edit',
        delete: 'comments.delete',
        reply: 'comments.reply',
        placeholder: 'comments.placeholder',
        noComments: 'comments.noComments',
        noCommentsMessage: 'comments.noCommentsMessage',
        posting: 'comments.posting',
        post: 'comments.post',
    },

    // User
    user: {
        profile: 'user.profile',
        settings: 'user.settings',
        posts: 'user.posts',
        followers: 'user.followers',
        following: 'user.following',
        memberSince: 'user.memberSince',
        bio: 'user.bio',
        location: 'user.location',
        website: 'user.website',
        editProfile: 'user.editProfile',
        changePassword: 'user.changePassword',
        deleteAccount: 'user.deleteAccount',
    },

    // Auth
    auth: {
        signIn: 'auth.signIn',
        signUp: 'auth.signUp',
        signOut: 'auth.signOut',
        email: 'auth.email',
        password: 'auth.password',
        confirmPassword: 'auth.confirmPassword',
        name: 'auth.name',
        forgotPassword: 'auth.forgotPassword',
        resetPassword: 'auth.resetPassword',
        rememberMe: 'auth.rememberMe',
        or: 'auth.or',
        withGoogle: 'auth.withGoogle',
        withEmail: 'auth.withEmail',
        noAccount: 'auth.noAccount',
        hasAccount: 'auth.hasAccount',
        createAccount: 'auth.createAccount',
        signInToAccount: 'auth.signInToAccount',
        welcomeBack: 'auth.welcomeBack',
        subtitle: 'auth.subtitle',
        enterEmail: 'auth.enterEmail',
        enterPassword: 'auth.enterPassword',
        signingIn: 'auth.signingIn',
        orContinueWith: 'auth.orContinueWith',
        continueWithGoogle: 'auth.continueWithGoogle',
    },

    // Notifications
    notifications: {
        title: 'notifications.title',
        markAsRead: 'notifications.markAsRead',
        markAllAsRead: 'notifications.markAllAsRead',
        noNotifications: 'notifications.noNotifications',
        noNotificationsMessage: 'notifications.noNotificationsMessage',
        newLike: 'notifications.newLike',
        newComment: 'notifications.newComment',
        newFollower: 'notifications.newFollower',
        postUpdate: 'notifications.postUpdate',
    },

    // Admin
    admin: {
        dashboard: 'admin.dashboard',
        users: 'admin.users',
        posts: 'admin.posts',
        analytics: 'admin.analytics',
        settings: 'admin.settings',
        banUser: 'admin.banUser',
        unbanUser: 'admin.unbanUser',
        deleteUser: 'admin.deleteUser',
        promoteToAdmin: 'admin.promoteToAdmin',
        demoteFromAdmin: 'admin.demoteFromAdmin',
        approvePost: 'admin.approvePost',
        rejectPost: 'admin.rejectPost',
        deletePost: 'admin.deletePost',
        manageUsers: 'admin.manageUsers',
        managePosts: 'admin.managePosts',
        totalUsers: 'admin.totalUsers',
        totalPosts: 'admin.totalPosts',
        activeUsers: 'admin.activeUsers',
        bannedUsers: 'admin.bannedUsers',
        accessDenied: 'admin.accessDenied',
        noPermission: 'admin.noPermission',
    },

    // Settings
    settings: {
        title: 'settings.title',
        appearance: 'settings.appearance',
        language: 'settings.language',
        notifications: 'settings.notifications',
        privacy: 'settings.privacy',
        security: 'settings.security',
        account: 'settings.account',
        theme: 'settings.theme',
        light: 'settings.light',
        dark: 'settings.dark',
        system: 'settings.system',
    },

    // Errors
    errors: {
        notFound: 'errors.notFound',
        unauthorized: 'errors.unauthorized',
        forbidden: 'errors.forbidden',
        serverError: 'errors.serverError',
        networkError: 'errors.networkError',
        validationError: 'errors.validationError',
        invalidCredentials: 'errors.invalidCredentials',
        emailAlreadyExists: 'errors.emailAlreadyExists',
        weakPassword: 'errors.weakPassword',
        invalidEmail: 'errors.invalidEmail',
    },

    // Home
    home: {
        latestUpdates: 'home.latestUpdates',
        stayUpToDate: 'home.stayUpToDate',
    },

    // Explore
    explore: {
        title: 'explore.title',
        subtitle: 'explore.subtitle',
        viral: 'explore.viral',
        trending: 'explore.trending',
        interested: 'explore.interested',
        latest: 'explore.latest',
        viralDescription: 'explore.viralDescription',
        trendingDescription: 'explore.trendingDescription',
        interestedDescription: 'explore.interestedDescription',
        latestDescription: 'explore.latestDescription',
        noViralPosts: 'explore.noViralPosts',
        noTrendingPosts: 'explore.noTrendingPosts',
        noInterestedPosts: 'explore.noInterestedPosts',
        noLatestPosts: 'explore.noLatestPosts',
        checkBackLater: 'explore.checkBackLater',
        trendingTags: 'explore.trendingTags',
        topAuthors: 'explore.topAuthors',
        platformStats: 'explore.platformStats',
        totalPosts: 'explore.totalPosts',
        activeUsers: 'explore.activeUsers',
        totalLikes: 'explore.totalLikes',
        comments: 'explore.comments',
    },

    // Header
    header: {
        nexblog: 'header.nexblog',
        newPost: 'header.newPost',
        searchPlaceholder: 'header.searchPlaceholder',
        toggleTheme: 'header.toggleTheme',
        profile: 'header.profile',
        adminDashboard: 'header.adminDashboard',
    },

    // File Upload
    upload: {
        invalidType: 'upload.invalidType',
        tooLarge: 'upload.tooLarge',
        failed: 'upload.failed',
        mustBeLoggedIn: 'upload.mustBeLoggedIn',
        uploading: 'upload.uploading',
        profilePicture: 'upload.profilePicture',
        image: 'upload.image',
    },

    // General
    general: {
        error: 'general.error',
        unauthorized: 'general.unauthorized',
        internalServerError: 'general.internalServerError',
        user: 'general.user',
        actions: 'general.actions',
        title: 'general.title',
        status: 'general.status',
        role: 'general.role',
        email: 'general.email',
        createdAt: 'general.createdAt',
        updatedAt: 'general.updatedAt',
    },
} as const 