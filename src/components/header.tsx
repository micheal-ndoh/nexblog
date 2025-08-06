"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
// Removed unused import
import { useNotificationStore } from "@/lib/store";
import { useThemeStore, applyTheme } from "@/lib/theme";
import { useT, languages } from "@/lib/tolgee";
import { SignoutModal } from "./signout-modal";

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const { unreadCount } = useNotificationStore();
  const { theme, setTheme } = useThemeStore();
  const { changeLanguage, getLanguage } = useT();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isSignoutModalOpen, setIsSignoutModalOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setIsThemeMenuOpen(false);
      }
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = () => {
    setIsSignoutModalOpen(true);
    setIsUserMenuOpen(false);
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    applyTheme(newTheme);
    setIsThemeMenuOpen(false);
  };

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsLanguageMenuOpen(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <SunIcon className="h-6 w-6" />;
      case "dark":
        return <MoonIcon className="h-6 w-6" />;
      case "system":
        return <ComputerDesktopIcon className="h-6 w-6" />;
      default:
        return <SunIcon className="h-6 w-6" />;
    }
  };

  const currentLanguage =
    languages.find((lang) => lang.code === getLanguage()) || languages[1]; // Default to English

  return (
    <header className="bg-black/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-40 ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Search */}
          <div className="flex items-center gap-6">
            {/* NexBlog Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 48 48"
                    className="w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors">
                  NexBlog
                </h1>
              </Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts, users, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-12 pr-4 py-3 border border-gray-700/50 rounded-xl bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="p-3 text-gray-300 hover:text-orange-500 transition-colors rounded-xl hover:bg-gray-800/50 backdrop-blur-sm"
                title="Change language"
              >
                <div className="flex items-center gap-2">
                  <GlobeAltIcon className="h-7 w-7" />
                  <span className="text-sm hidden sm:inline font-medium">
                    {currentLanguage.flag}
                  </span>
                </div>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-700/50 py-2 z-50 max-h-64 overflow-y-auto">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-700/50 transition-colors ${
                        getLanguage() === language.code
                          ? "text-orange-500 bg-orange-500/10"
                          : "text-gray-300"
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span className="truncate font-medium">
                        {language.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-3 text-gray-300 hover:text-orange-500 transition-colors rounded-xl hover:bg-gray-800/50 backdrop-blur-sm"
                title="Toggle theme"
              >
                {getThemeIcon()}
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-700/50 py-2 z-50">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-700/50 transition-colors ${
                      theme === "light"
                        ? "text-orange-500 bg-orange-500/10"
                        : "text-gray-300"
                    }`}
                  >
                    <SunIcon className="h-5 w-5" />
                    <span className="font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-700/50 transition-colors ${
                      theme === "dark"
                        ? "text-orange-500 bg-orange-500/10"
                        : "text-gray-300"
                    }`}
                  >
                    <MoonIcon className="h-5 w-5" />
                    <span className="font-medium">Dark</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange("system")}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-700/50 transition-colors ${
                      theme === "system"
                        ? "text-orange-500 bg-orange-500/10"
                        : "text-gray-300"
                    }`}
                  >
                    <ComputerDesktopIcon className="h-5 w-5" />
                    <span className="font-medium">System</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <Link
              href="/notifications"
              className="relative p-3 text-gray-300 hover:text-orange-500 transition-colors rounded-xl hover:bg-gray-800/50 backdrop-blur-sm"
            >
              <BellIcon className="h-7 w-7" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-orange-500 text-white text-xs font-bold items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session?.user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800/50 backdrop-blur-sm transition-colors"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-gray-700"
                    />
                  ) : (
                    <UserCircleIcon className="w-12 h-12 text-gray-400" />
                  )}
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-700/50 py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-4 border-b border-gray-700/50">
                      <p className="text-lg font-bold text-white mb-1">
                        {session?.user?.name}
                      </p>
                      <p className="text-base text-gray-300 font-medium">
                        {session?.user?.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-4 px-4 py-4 text-lg text-white font-semibold hover:bg-gray-700/50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircleIcon className="h-7 w-7" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-4 px-4 py-4 text-lg text-white font-semibold hover:bg-gray-700/50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Cog6ToothIcon className="h-7 w-7" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-4 w-full px-4 py-4 text-lg text-white font-semibold hover:bg-gray-700/50 transition-colors"
                      >
                        <ArrowLeftOnRectangleIcon className="h-7 w-7" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="btn-primary px-6 py-2 rounded-xl font-semibold flex items-center hover:bg-orange-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="glassmorphism-dark px-6 py-2 rounded-xl font-semibold flex items-center text-white hover:bg-gray-800/50 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-3 text-gray-300 hover:text-orange-500 transition-colors rounded-xl hover:bg-gray-800/50 backdrop-blur-sm">
              <Bars3Icon className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Signout Modal */}
      <SignoutModal
        isOpen={isSignoutModalOpen}
        onClose={() => setIsSignoutModalOpen(false)}
      />
    </header>
  );
}
