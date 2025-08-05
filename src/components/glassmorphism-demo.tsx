"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

export function GlassmorphismDemo() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardHover = {
    y: -5,
    transition: { duration: 0.2 }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
}`}>
      <motion.div 
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Demo */}
        <motion.header 
          className="glass rounded-2xl p-4 mb-8"
          variants={itemVariants}
          whileHover={cardHover}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                NexBlog
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
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
                <span className="absolute -top-1 -right-1
        : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100'
    