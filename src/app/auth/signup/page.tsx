"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ExclamationTriangleIcon,
  ArrowRightIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Sign in the user after successful registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign in failed. Please try signing in.");
      } else {
        router.push("/");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative w-full max-w-md p-8 rounded-3xl glassmorphism text-white shadow-2xl">
        {/* Aurora Effect */}
        <div className="aurora-effect"></div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 text-orange-500">
              <svg
                fill="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">NexBlog</h1>
          </div>
          <h2 className="text-4xl font-bold mb-2">Create your account</h2>
          <p className="text-gray-400">
            Join us and start sharing your updates
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleEmailSignUp}>
          <div className="relative mb-6">
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-4 pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
              placeholder="Full Name"
            />
          </div>

          <div className="relative mb-6">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-4 pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
              placeholder="Email"
            />
          </div>

          <div className="relative mb-6">
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-4 pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
              placeholder="Password"
            />
          </div>

          <div className="relative mb-6">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              minLength={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-4 pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
              placeholder="Confirm Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-4 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="flex items-center my-8">
          <hr className="flex-grow border-gray-700" />
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-700" />
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-between bg-gray-800 border border-gray-700 rounded-full p-3 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="text-center mt-8 text-sm">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-orange-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
