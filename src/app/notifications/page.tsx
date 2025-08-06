"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/header";
import { formatDate } from "@/lib/utils";
import { useNotificationStore } from "@/lib/store";
import Link from "next/link";
import {
  Cog6ToothIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
  postId?: string; // Added for post/comment notifications
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { markAsRead, markAllAsRead } = useNotificationStore();
  const [showSettings, setShowSettings] = useState(false);
  const [sortType, setSortType] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      });

      if (response.ok) {
        markAsRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
      });

      if (response.ok) {
        markAllAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleDeleteAll = async () => {
    // TODO: Implement delete all notifications API call
    setNotifications([]);
    setShowSettings(false);
  };

  const handleSort = (type: string) => {
    setSortType(type);
    setShowSettings(false);
    if (type === "likes") {
      setNotifications((prev) =>
        [...prev].sort((a, b) => (b.type === "LIKE" ? 1 : -1))
      );
    } else if (type === "comments") {
      setNotifications((prev) =>
        [...prev].sort((a, b) => (b.type === "COMMENT" ? 1 : -1))
      );
    } else {
      fetchNotifications();
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sign in to view notifications
            </h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <div className="relative flex gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Mark all as read
            </button>
            <button
              onClick={() => setShowSettings((v) => !v)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <Cog6ToothIcon className="w-4 h-4 mr-1" /> Settings
            </button>
            {showSettings && (
              <div className="absolute right-0 top-12 z-50 glassmorphism-card w-56 rounded-xl shadow-xl p-4 animate-fade-in-up">
                <button
                  onClick={handleDeleteAll}
                  className="flex items-center gap-3 w-full px-4 py-3 text-base text-red-400 hover:bg-red-900/20 rounded-xl transition-colors mb-2"
                >
                  <TrashIcon className="w-6 h-6" />
                  Delete All
                </button>
                <button
                  onClick={() => handleSort("likes")}
                  className="flex items-center gap-3 w-full px-4 py-3 text-base text-white hover:bg-gray-800/50 rounded-xl transition-colors mb-2"
                >
                  <HeartIcon className="w-6 h-6 text-pink-400" />
                  Sort by Likes
                </button>
                <button
                  onClick={() => handleSort("comments")}
                  className="flex items-center gap-3 w-full px-4 py-3 text-base text-white hover:bg-gray-800/50 rounded-xl transition-colors mb-2"
                >
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-400" />
                  Sort by Comments
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-base text-gray-400 hover:bg-gray-800/50 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => {
                  let link = undefined;
                  if (
                    notification.type === "COMMENT" ||
                    notification.type === "LIKE" ||
                    notification.type === "INTERESTED_UPDATE"
                  ) {
                    link = `/posts/${notification.postId}`;
                  } else if (notification.type === "PROFILE_VIEW") {
                    link = `/users/${notification.user.id}`;
                  }
                  return (
                    <Link
                      key={notification.id}
                      href={link || "#"}
                      className="block"
                      onClick={() =>
                        !notification.read && handleMarkAsRead(notification.id)
                      }
                    >
                      <div
                        className={`flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          !notification.read
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : ""
                        }`}
                      >
                        <img
                          src={notification.user.image || "/default-avatar.png"}
                          alt={notification.user.name}
                          className="w-12 h-12 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white text-base font-medium">
                            {notification.user.name}{" "}
                            {notification.title.toLowerCase()}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  When you receive notifications, they&apos;ll appear here.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
