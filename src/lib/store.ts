import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
    theme: 'light' | 'dark'
    language: string
    notifications: boolean
    setTheme: (theme: 'light' | 'dark') => void
    setLanguage: (language: string) => void
    setNotifications: (enabled: boolean) => void
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            theme: 'light',
            language: 'en',
            notifications: true,
            setTheme: (theme) => set({ theme }),
            setLanguage: (language) => set({ language }),
            setNotifications: (notifications) => set({ notifications }),
        }),
        {
            name: 'nexblog-storage',
        }
    )
)

interface NotificationState {
    notifications: Array<{
        id: string
        type: string
        title: string
        message: string
        read: boolean
        createdAt: Date
    }>
    unreadCount: number
    addNotification: (notification: any) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    setNotifications: (notifications: any[]) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    addNotification: (notification) => {
        const { notifications } = get()
        const newNotifications = [notification, ...notifications]
        const unreadCount = newNotifications.filter(n => !n.read).length
        set({ notifications: newNotifications, unreadCount })
    },
    markAsRead: (id) => {
        const { notifications } = get()
        const updatedNotifications = notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        )
        const unreadCount = updatedNotifications.filter(n => !n.read).length
        set({ notifications: updatedNotifications, unreadCount })
    },
    markAllAsRead: () => {
        const { notifications } = get()
        const updatedNotifications = notifications.map(n => ({ ...n, read: true }))
        set({ notifications: updatedNotifications, unreadCount: 0 })
    },
    setNotifications: (notifications) => {
        const unreadCount = notifications.filter(n => !n.read).length
        set({ notifications, unreadCount })
    },
})) 