"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import { FileUpload } from "@/components/file-upload";
import {
  UserIcon,
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
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-800 rounded w-1/3 mb-3 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-gray-800 rounded w-1/2 mb-6 sm:mb-8"></div>
            <div className="space-y-3 sm:space-y-4">
              <div className="h-10 sm:h-12 bg-gray-800 rounded"></div>
              <div className="h-10 sm:h-12 bg-gray-800 rounded"></div>
              <div className="h-10 sm:h-12 bg-gray-800 rounded"></div>
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
      <div className="max-w-4xl mx-auto px-0 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Profile
          </h1>
          <p className="text-gray-400 text-xs sm:text-base">
            Manage your profile information and preferences
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3">
            <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-900/20 border border-green-800 rounded-lg flex items-center gap-3">
            <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-green-400">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="glassmorphism-card rounded-2xl p-4 sm:p-6 lg:p-8 text-center">
              <div className="mb-4 sm:mb-6">
                {profile.image ? (
                  <div className="relative inline-block">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-700"
                    />
                    <button
                      onClick={() => handleChange("image", "")}
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                    <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </div>
                )}
              </div>

              {!profile.image && (
                <FileUpload
                  type="profile"
                  onUpload={(url) => handleChange("image", url)}
                  onError={setError}
                  className="mb-3 sm:mb-4"
                >
                  <div className="flex items-center justify-center gap-2 text-orange-400 hover:text-orange-300 transition-colors cursor-pointer text-sm sm:text-base">
                    <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Upload Photo</span>
                  </div>
                </FileUpload>
              )}

              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                  {profile.name || "User"}
                </h2>
                <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                  {profile.email}
                </p>
                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs sm:text-sm">
                  <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Member since {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="lg:col-span-2">
            <div className="glassmorphism-card rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">
                    Profile Information
                  </h2>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="profile-name"
                      value={profile.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-email"
                      className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="profile-email"
                      value={profile.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="profile-bio"
                    className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
                  >
                    Bio
                  </label>
                  <textarea
                    id="profile-bio"
                    value={profile.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label
                      htmlFor="profile-location"
                      className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="profile-location"
                      value={profile.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      placeholder="Where are you located?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-website"
                      className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
                    >
                      Website
                    </label>
                    <input
                      type="url"
                      id="profile-website"
                      value={profile.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-700">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Statistics */}
            <div className="mt-4 sm:mt-8 glassmorphism-card rounded-2xl p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                Account Statistics
              </h3>
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1 sm:mb-2">
                    0
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1 sm:mb-2">
                    0
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">
                    Comments
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1 sm:mb-2">
                    0
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">Likes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
