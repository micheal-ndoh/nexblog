"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import { useThemeStore, applyTheme } from "@/lib/theme";
import { useLanguageStore, languages, type Language } from "@/lib/language";
import { FileUpload } from "@/components/file-upload";
import {
  UserIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface UserSettings {
  name: string;
  email: string;
  image?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { theme, setTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Load user settings when session is available
  useEffect(() => {
    if (session?.user) {
      setSettings({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      });
    }
  }, [session]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update settings");
      }

      // Update the session with new data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: settings.name,
          email: settings.email,
          image: settings.image,
        },
      });

      setSuccess("Settings updated successfully!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setShowLanguageDropdown(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6 text-green-400" />
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        {/* Profile Settings */}
        <div className="bg-custom-dark rounded-2xl shadow-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <UserIcon className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-semibold text-white">
              Profile Settings
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Display Name
              </label>
              <input
                id="name"
                type="text"
                value={settings.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile Picture
              </label>
              {settings.image ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <img
                      src={settings.image}
                      alt="Profile picture"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleChange("image", "")}
                        className="px-3 py-1 text-sm text-red-400 hover:bg-red-900/20 rounded transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <FileUpload
                  type="profile"
                  onUpload={(url) => handleChange("image", url)}
                  onError={setError}
                  className="mb-2"
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Upload Profile Picture</span>
                </FileUpload>
              )}
              <p className="text-sm text-gray-400">
                Upload a profile picture or leave empty to use your default
                avatar
              </p>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 btn-primary rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-orange-600"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Theme Settings */}
        <div className="bg-custom-dark rounded-2xl shadow-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Cog6ToothIcon className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-semibold text-white">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "light", label: "Light", icon: SunIcon },
                  { value: "dark", label: "Dark", icon: MoonIcon },
                  {
                    value: "system",
                    label: "System",
                    icon: ComputerDesktopIcon,
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleThemeChange(
                        option.value as "light" | "dark" | "system"
                      )
                    }
                    className={`p-4 rounded-lg border transition-colors ${
                      theme === option.value
                        ? "border-orange-500 bg-orange-500/10 text-orange-500"
                        : "border-gray-700 hover:bg-gray-800 text-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <option.icon className="w-6 h-6" />
                      <div className="text-sm font-medium">{option.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-custom-dark rounded-2xl shadow-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <GlobeAltIcon className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-semibold text-white">Language</h2>
          </div>

          <div className="relative" ref={languageDropdownRef}>
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="w-full flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{languages[language].flag}</span>
                <span>{languages[language].name}</span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showLanguageDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {Object.entries(languages).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code as Language)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors ${
                      language === code
                        ? "bg-orange-500/10 text-orange-500"
                        : "text-gray-300"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-custom-dark rounded-2xl shadow-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Account Actions
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => router.push("/auth/signin")}
              className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Change Password
            </button>
            <button
              onClick={() => router.push("/auth/signin")}
              className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
