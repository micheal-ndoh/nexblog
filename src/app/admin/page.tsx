"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/tolgee";
import { Layout } from "@/components/layout";
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
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [productMenuOpen, setProductMenuOpen] = useState(true);

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
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">
              {t("admin.accessDenied")}
            </h1>
            <p className="text-gray-400">{t("admin.noPermission")}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <img
              alt="User avatar"
              className="w-8 h-8 rounded-full"
              src={session.user.image || "https://via.placeholder.com/32"}
            />
            <button className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center hover:bg-orange-600 transition-colors">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-500/20 border border-green-500/50"
                : "bg-red-500/20 border border-red-500/50"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-red-400" />
            )}
            <span
              className={`text-sm ${
                message.type === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message.text}
            </span>
            <button
              onClick={clearMessage}
              className="ml-auto text-gray-400 hover:text-gray-300"
            >
              <XCircleIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === "overview"
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === "users"
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === "posts"
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === "analytics"
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Card */}
              <div className="glassmorphism-card rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Overview</h2>
                  <button className="text-gray-400 text-sm border border-gray-600 px-3 py-1 rounded-lg">
                    Last 7 days
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm">Users</p>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <p className="text-4xl font-bold text-white">
                        {users.length}
                      </p>
                      <div className="flex items-center text-green-500 text-sm">
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                        <span>+12.5%</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">vs last month</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Posts</p>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <p className="text-4xl font-bold text-white">
                        {posts.length}
                      </p>
                      <div className="flex items-center text-green-500 text-sm">
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                        <span>+8.2%</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">vs last month</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glassmorphism-card rounded-xl p-6">
                <h3 className="font-semibold mb-1 text-white">
                  Recent Activity
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Latest user registrations and posts.
                </p>
                <div className="space-y-3">
                  {users.slice(0, 3).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posts Chart */}
              <div className="glassmorphism-card rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Posts Activity
                  </h2>
                  <button className="text-gray-400 text-sm border border-gray-600 px-3 py-1 rounded-lg">
                    Last 7 days
                  </button>
                </div>
                <div className="mb-4">
                  <p className="text-4xl font-bold text-white">
                    {posts.length}
                  </p>
                  <div className="flex items-center text-green-500 text-sm mt-1">
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                    <span>+15.3%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="flex items-end justify-between h-40">
                  {[14, 15, 16, 17, 18, 19, 20].map((day, index) => (
                    <div
                      key={day}
                      className="w-1/7 flex flex-col items-center justify-end"
                    >
                      <div
                        className={`w-1/2 rounded-t-md ${
                          day === 17 ? "bg-orange-500 h-full" : "bg-gray-600"
                        }`}
                        style={{ height: `${Math.random() * 60 + 20}%` }}
                      ></div>
                      <span className="text-xs text-gray-400 mt-2">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="glassmorphism-card rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Quick Stats
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Users</span>
                    <span className="text-white font-semibold">
                      {users.filter((u) => !u.isBanned).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Banned Users</span>
                    <span className="text-red-400 font-semibold">
                      {users.filter((u) => u.isBanned).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Published Posts</span>
                    <span className="text-green-400 font-semibold">
                      {posts.filter((p) => p.published).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Draft Posts</span>
                    <span className="text-yellow-400 font-semibold">
                      {posts.filter((p) => !p.published).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Posts */}
              <div className="glassmorphism-card rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Recent Posts
                </h2>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-white text-sm">
                            {post.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {post.author.name}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          post.published
                            ? "text-green-400 bg-green-900/50"
                            : "text-yellow-400 bg-yellow-900/50"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600">
                  View All Posts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="glassmorphism-card rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-2 text-gray-400">{t("common.loading")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("general.user")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("general.email")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("general.role")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("general.status")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("admin.activity")}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("general.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === "ADMIN"
                                ? "bg-blue-900/50 text-blue-400"
                                : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isBanned
                                ? "bg-red-900/50 text-red-400"
                                : "bg-green-900/50 text-green-400"
                            }`}
                          >
                            {user.isBanned
                              ? t("admin.banned")
                              : t("admin.active")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">
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
                                className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
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
                                disabled={actionLoading === `demote-${user.id}`}
                                className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50"
                                title={t("admin.demoteFromAdmin")}
                              >
                                <UserMinusIcon className="h-4 w-4" />
                              </button>
                            )}
                            {!user.isBanned ? (
                              <button
                                onClick={() => handleUserAction(user.id, "ban")}
                                disabled={actionLoading === `ban-${user.id}`}
                                className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50"
                                title={t("admin.banUser")}
                              >
                                <NoSymbolIcon className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleUserAction(user.id, "unban")
                                }
                                disabled={actionLoading === `unban-${user.id}`}
                                className="text-green-400 hover:text-green-300 disabled:opacity-50"
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
                              className="text-red-400 hover:text-red-300 disabled:opacity-50"
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
          <div className="glassmorphism-card rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-2 text-gray-400">{t("common.loading")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("general.title")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("posts.author")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("general.status")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("admin.engagement")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("general.createdAt")}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("general.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {post.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">
                            {post.author.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              post.published
                                ? "bg-green-900/50 text-green-400"
                                : "bg-yellow-900/50 text-yellow-400"
                            }`}
                          >
                            {post.published
                              ? t("posts.published")
                              : t("posts.draft")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">
                            <div>
                              {post._count.likes} {t("posts.likes")}
                            </div>
                            <div>
                              {post._count.comments} {t("posts.comments")}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-blue-400 hover:text-blue-300">
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
                                className="text-green-400 hover:text-green-300 disabled:opacity-50"
                                title={t("admin.approvePost")}
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handlePostAction(post.id, "reject")
                                }
                                disabled={actionLoading === `reject-${post.id}`}
                                className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50"
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
                              className="text-red-400 hover:text-red-300 disabled:opacity-50"
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
              <div className="glassmorphism-card rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        {t("admin.totalUsers")}
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {analytics.overview.totalUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="glassmorphism-card rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        {t("admin.totalPosts")}
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {analytics.overview.totalPosts}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="glassmorphism-card rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ArrowTrendingUpIcon className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        {t("admin.engagementRate")}
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {analytics.overview.engagementRate}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="glassmorphism-card rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <StarIcon className="h-8 w-8 text-orange-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        {t("admin.postsPerUser")}
                      </dt>
                      <dd className="text-lg font-medium text-white">
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
              <div className="glassmorphism-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {t("admin.topUsers")}
                </h3>
                <div className="space-y-3">
                  {analytics.topUsers.map((user, index) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-blue-400 font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-400">
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
              <div className="glassmorphism-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {t("admin.topPosts")}
                </h3>
                <div className="space-y-3">
                  {analytics.topPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-900 rounded-full flex items-center justify-center text-green-400 font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-400">
                            {post._count.likes} {t("posts.likes")} •{" "}
                            {post._count.comments} {t("posts.comments")}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          post.published
                            ? "bg-green-900/50 text-green-400"
                            : "bg-yellow-900/50 text-yellow-400"
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
      </div>
    </Layout>
  );
}
