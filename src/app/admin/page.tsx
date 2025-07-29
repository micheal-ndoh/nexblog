"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}
import {
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

interface Post {
  id: string;
  title: string;
  author: {
    name: string;
  };
  createdAt: string;
  published: boolean;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchData = useCallback(async () => {
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
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [activeTab]);

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
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: "POST",
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Error performing user action:", error);
    }
  };

  const handlePostAction = async (postId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}/${action}`, {
        method: "POST",
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Error performing post action:", error);
    }
  };

  if (!session?.user || (session.user as SessionUser).role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You don&apos;t have permission to access this page.
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
              Admin Panel
            </h1>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "users"
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <UsersIcon className="h-6 w-6" />
                <span className="font-medium">Users</span>
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
                <span className="font-medium">Posts</span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "analytics"
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <ChartBarIcon className="h-6 w-6" />
                <span className="font-medium">Analytics</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {activeTab === "users" && "Manage Users"}
              {activeTab === "posts" && "Manage Posts"}
              {activeTab === "analytics" && "Analytics"}
            </h2>
          </div>

          {activeTab === "users" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {user.role !== "ADMIN" && (
                              <button
                                onClick={() =>
                                  handleUserAction(user.id, "promote")
                                }
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                              >
                                <ShieldCheckIcon className="h-4 w-4" />
                              </button>
                            )}
                            {!user.isBanned ? (
                              <button
                                onClick={() => handleUserAction(user.id, "ban")}
                                className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                              >
                                <UserMinusIcon className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleUserAction(user.id, "unban")
                                }
                                className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                              >
                                <UsersIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleUserAction(user.id, "delete")
                              }
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
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
            </div>
          )}

          {activeTab === "posts" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
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
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handlePostAction(post.id, "delete")
                              }
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
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
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total Users
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
                        Total Posts
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
                    <ChartBarIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Active Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {users.filter((u) => !u.isBanned).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserMinusIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Banned Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {users.filter((u) => u.isBanned).length}
                      </dd>
                    </dl>
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
