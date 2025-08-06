"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  ExclamationTriangleIcon,
  ArrowRightIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";

interface SignoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignoutModal({ isOpen, onClose }: SignoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleSignout = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
    }
  };

  if (!isOpen || !isBrowser) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-2xl z-[1001]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-fade-in-up z-[1002]">
        <div className="relative bg-black/90 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Aurora Effect */}
          <div className="aurora-effect" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="relative z-10 p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 text-orange-500">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  NexBlog
                </h1>
              </div>
            </div>

            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Sign Out</h2>
              <p className="text-gray-400">
                Are you sure you want to sign out of your account?
              </p>
            </div>

            {/* Success State */}
            {isSuccess && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg flex items-center gap-3">
                <CheckIcon className="w-5 h-5 text-green-400" />
                <p className="text-sm text-green-400">
                  Successfully signed out!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleSignout}
                disabled={isLoading}
                className="w-full relative bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-4 px-6 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing out...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Confirm Sign Out</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>

              <button
                onClick={onClose}
                disabled={isLoading}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-xl py-4 px-6 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                You can sign back in anytime using your credentials
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
