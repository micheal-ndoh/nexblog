"use client"

import React from 'react'
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

export function TolgeeWrapper({ children }: { children: React.ReactNode }) {
    // TODO: Implement full Tolgee integration when API key is available
    return React.createElement(React.Fragment, null, children)
}

// Simple translation hook for now
export function useT() {
    const { language } = useAppStore()

    const t = (key: string, params?: Record<string, unknown>) => {
        // For now, return the key as-is
        // In a full implementation, this would look up translations
        return key
    }

    const changeLanguage = (lang: string) => {
        // This would change the language in Tolgee
        console.log('Language changed to:', lang)
    }

    const getLanguage = () => language || 'en'

    return { t, changeLanguage, getLanguage }
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
} as const 