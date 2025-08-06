"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import { FileUpload } from "@/components/file-upload";
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface UserProfile {
  name: string;
  email: string;
  image?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    image: "",
    bio: "",
    location: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load user profile when session is available
  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
        bio: "",
        location: "",
        website: "",
      });
    }
  }, [session]);

  // Redirect if not authenticated
  if (status === "loading") {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-800 rounded"></div>
              <div className="h-12 bg-gray-800 rounded"></div>
              <div className="h-12 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          image: profile.image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      // Update the session with new data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: profile.name,
          email: profile.email,
          image: profile.image,
        },
      });

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">
            Manage your profile information and preferences
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3">
            <XMarkIcon className="w-5 h-5 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg flex items-center gap-3">
            <CheckIcon className="w-5 h-5 text-green-400" />
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="md:col-span-1">
            <div className="bg-custom-dark rounded-2xl shadow-lg border border-gray-700 p-8 text-center">
              <div className="mb-6">
                {profile.image ? (
                  <div className="relative inline-block">
                    <img
                      src={profile.image}
                      alt="Profile picture"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                    />
                    <button
                      onClick={() => handleChange("image", "")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                    <UserIcon className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              {!profile.image && (
                <FileUpload
                  type="profile"
                  onUpload={(url) => handleChange("image", url)}
                  onError={setError}
                  className="mb-4"
                >
                  <div className="flex items-center justify-center gap-2 text-orange-400 hover:text-orange-300 transition-colors cursor-pointer">
                    <CameraIcon className="w-5 h-5" />
                    <span>Upload Photo</span>
                  </div>
                </FileUpload>
              )}

              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {profile.name || "User"}
                </h2>
                <p className="text-gray-400 mb-4">{profile.email}</p>
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Member since {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="md:col-span-2">
            <div className="bg-custom-dark rounded-2xl shadow-lg border border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-semibold text-white">
                    Profile Information
                  </h2>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Where are you located?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4 border-t border-gray-700">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Statistics */}
            <div className="mt-8 bg-custom-dark rounded-2xl shadow-lg border border-gray-700 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">
                Account Statistics
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    0
                  </div>
                  <div className="text-gray-400 text-sm">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    0
                  </div>
                  <div className="text-gray-400 text-sm">Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    0
                  </div>
                  <div className="text-gray-400 text-sm">Likes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
