"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { useT } from "@/lib/tolgee";
import {
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  UserMinusIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  NoSymbolIcon,
  CogIcon,
  BellIcon,
  CalendarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
  _count: {
    posts: number;
    comments: number;
    likes: number;
  };
}

interface Post {
  id: string;
  title: string;
  author: {
    name: string;
  };
  createdAt: string;
  published: boolean;
  _count: {
    likes: number;
    comments: number;
  };
}

interface Analytics {
  overview: {
    totalUsers: number;
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
    bannedUsers: number;
    publishedPosts: number;
    draftPosts: number;
    recentUsers: number;
    recentPosts: number;
    engagementRate: number;
    postsPerUser: number;
  };
  topUsers: Array<{
    id: string;
    name: string;
    email: string;
    _count: {
      posts: number;
      comments: number;
      likes: number;
    };
  }>;
  topPosts: Array<{
    id: string;
    title: string;
    published: boolean;
    createdAt: string;
    author: {
      name: string;
    };
    _count: {
      likes: number;
      comments: number;
    };
  }>;
  monthlyData: Array<{
    month: string;
    users: number;
    posts: number;
  }>;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useT();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } else if (activeTab === "posts") {
        const response = await fetch("/api/admin/posts");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } else if (activeTab === "analytics") {
        const response = await fetch("/api/admin/analytics");
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({ type: "error", text: t("admin.error.fetchingData") });
    } finally {
      setLoading(false);
    }
  }, [activeTab, t]);

  useEffect(() => {
    if (session?.user) {
      if ((session.user as SessionUser).role !== "ADMIN") {
        router.push("/");
        return;
      }
      fetchData();
    }
  }, [session, router, fetchData]);

  const handleUserAction = async (userId: string, action: string) => {
    setActionLoading(`${action}-${userId}`);
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: "success", text: result.message });
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.message });
      }
    } catch (error) {
      console.error("Error performing user action:", error);
      setMessage({ type: "error", text: t("admin.error.actionFailed") });
    } finally {
      setActionLoading(null);
    }
  };

  const handlePostAction = async (postId: string, action: string) => {
    setActionLoading(`${action}-${postId}`);
    try {
      const response = await fetch(`/api/admin/posts/${postId}/${action}`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: "success", text: result.message });
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.message });
      }
    } catch (error) {
      console.error("Error performing post action:", error);
      setMessage({ type: "error", text: t("admin.error.actionFailed") });
    } finally {
      setActionLoading(null);
    }
  };

  const clearMessage = () => {
    setMessage(null);
  };

  if (!session?.user || (session.user as SessionUser).role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("admin.accessDenied")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("admin.noPermission")}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {t("admin.dashboard")}
            </h1>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "overview"
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <ChartBarIcon className="h-6 w-6" />
                <span className="font-medium">{t("admin.overview")}</span>
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "users"
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <UsersIcon className="h-6 w-6" />
                <span className="font-medium">{t("admin.users")}</span>
              </button>

              <button
                onClick={() => setActiveTab("posts")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "posts"
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <DocumentTextIcon className="h-6 w-6" />
                <span className="font-medium">{t("admin.posts")}</span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "analytics"
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <ArrowTrendingUpIcon className="h-6 w-6" />
                <span className="font-medium">{t("admin.analytics")}</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  message.type === "success"
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {message.text}
              </span>
              <button
                onClick={clearMessage}
                className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {activeTab === "overview" && t("admin.overview")}
              {activeTab === "users" && t("admin.manageUsers")}
              {activeTab === "posts" && t("admin.managePosts")}
              {activeTab === "analytics" && t("admin.analytics")}
            </h2>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {t("admin.totalUsers")}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {users.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DocumentTextIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {t("admin.totalPosts")}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {posts.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <NoSymbolIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {t("admin.bannedUsers")}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {users.filter((u) => u.isBanned).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FireIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {t("admin.activeUsers")}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {users.filter((u) => !u.isBanned).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t("admin.quickActions")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("users")}
                    className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {t("admin.manageUsers")}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t("admin.manageUsersDesc")}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("posts")}
                    className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <DocumentTextIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {t("admin.managePosts")}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t("admin.managePostsDesc")}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {t("admin.viewAnalytics")}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t("admin.viewAnalyticsDesc")}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {t("common.loading")}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("general.user")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("general.email")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("general.role")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("general.status")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("admin.activity")}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("general.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === "ADMIN"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isBanned
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                              }`}
                            >
                              {user.isBanned
                                ? t("admin.banned")
                                : t("admin.active")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <div>
                                {user._count.posts} {t("posts.title")}
                              </div>
                              <div>
                                {user._count.comments} {t("comments.title")}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              {user.role !== "ADMIN" && (
                                <button
                                  onClick={() =>
                                    handleUserAction(user.id, "promote")
                                  }
                                  disabled={
                                    actionLoading === `promote-${user.id}`
                                  }
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 disabled:opacity-50"
                                  title={t("admin.promoteToAdmin")}
                                >
                                  <ShieldCheckIcon className="h-4 w-4" />
                                </button>
                              )}
                              {user.role === "ADMIN" && (
                                <button
                                  onClick={() =>
                                    handleUserAction(user.id, "demote")
                                  }
                                  disabled={
                                    actionLoading === `demote-${user.id}`
                                  }
                                  className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 disabled:opacity-50"
                                  title={t("admin.demoteFromAdmin")}
                                >
                                  <UserMinusIcon className="h-4 w-4" />
                                </button>
                              )}
                              {!user.isBanned ? (
                                <button
                                  onClick={() =>
                                    handleUserAction(user.id, "ban")
                                  }
                                  disabled={actionLoading === `ban-${user.id}`}
                                  className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 disabled:opacity-50"
                                  title={t("admin.banUser")}
                                >
                                  <NoSymbolIcon className="h-4 w-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleUserAction(user.id, "unban")
                                  }
                                  disabled={
                                    actionLoading === `unban-${user.id}`
                                  }
                                  className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 disabled:opacity-50"
                                  title={t("admin.unbanUser")}
                                >
                                  <UserPlusIcon className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handleUserAction(user.id, "delete")
                                }
                                disabled={actionLoading === `delete-${user.id}`}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50"
                                title={t("admin.deleteUser")}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {t("common.loading")}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("general.title")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("posts.author")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("general.status")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("admin.engagement")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("general.createdAt")}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {t("general.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {posts.map((post) => (
                        <tr
                          key={post.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {post.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {post.author.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                post.published
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                              }`}
                            >
                              {post.published
                                ? t("posts.published")
                                : t("posts.draft")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <div>
                                {post._count.likes} {t("posts.likes")}
                              </div>
                              <div>
                                {post._count.comments} {t("posts.comments")}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              {!post.published ? (
                                <button
                                  onClick={() =>
                                    handlePostAction(post.id, "approve")
                                  }
                                  disabled={
                                    actionLoading === `approve-${post.id}`
                                  }
                                  className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 disabled:opacity-50"
                                  title={t("admin.approvePost")}
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handlePostAction(post.id, "reject")
                                  }
                                  disabled={
                                    actionLoading === `reject-${post.id}`
                                  }
                                  className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 disabled:opacity-50"
                                  title={t("admin.rejectPost")}
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handlePostAction(post.id, "delete")
                                }
                                disabled={actionLoading === `delete-${post.id}`}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50"
                                title={t("admin.deletePost")}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && analytics && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {t("admin.totalUsers")}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {analytics.overview.totalUsers}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DocumentTextIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {t("admin.totalPosts")}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {analytics.overview.totalPosts}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {t("admin.engagementRate")}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {analytics.overview.engagementRate}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <StarIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {t("admin.postsPerUser")}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {analytics.overview.postsPerUser}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Users and Posts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Users */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t("admin.topUsers")}
                  </h3>
                  <div className="space-y-3">
                    {analytics.topUsers.map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user._count.posts} {t("posts.title")} •{" "}
                              {user._count.comments} {t("comments.title")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Posts */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t("admin.topPosts")}
                  </h3>
                  <div className="space-y-3">
                    {analytics.topPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {post._count.likes} {t("posts.likes")} •{" "}
                              {post._count.comments} {t("posts.comments")}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.published
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                          }`}
                        >
                          {post.published
                            ? t("posts.published")
                            : t("posts.draft")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
