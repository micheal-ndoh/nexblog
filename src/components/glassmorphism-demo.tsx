"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export function GlassmorphismDemo() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardHover = {
    y: -5,
    transition: { duration: 0.2 },
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100"
      }`}
    >
      <motion.div
        className="container mx-auto px-4 py-8 sm:px-6 sm:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Demo */}
        <motion.header
          className="glass rounded-2xl p-4 mb-8 sm:p-6 sm:mb-10"
          variants={itemVariants}
          whileHover={cardHover}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                NexBlog
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <motion.div
                className="glass-card p-2 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </motion.div>
              <motion.div
                className="glass-card p-2 rounded-lg cursor-pointer relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.div>
              <motion.button
                onClick={toggleTheme}
                className="glass-card p-2 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === "light" ? (
                  <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <SunIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>
              <motion.div
                className="glass-card p-2 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserCircleIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </motion.div>
            </div>
          </div>
        </motion.header>
        {/* Content Demo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <motion.div
              key={item}
              className="glass-card rounded-2xl p-4 sm:p-6"
              variants={itemVariants}
              whileHover={cardHover}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <PlusIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {item} min ago
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                Glassmorphism Card {item}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                This is a beautiful glassmorphism card with smooth animations
                and hover effects.
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
