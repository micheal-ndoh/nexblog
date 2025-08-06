"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useT } from "@/lib/tolgee";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

// Component that uses useSearchParams - needs to be wrapped in Suspense
function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle OAuth errors from URL parameters
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "Callback":
          setError(t("signin.error.googleCancelled"));
          break;
        case "OAuthSignin":
          setError(t("signin.error.googleStart"));
          break;
        case "OAuthCallback":
          setError(t("signin.error.googleCallback"));
          break;
        case "OAuthCreateAccount":
          setError(t("signin.error.googleCreate"));
          break;
        case "EmailCreateAccount":
          setError(t("signin.error.emailCreate"));
          break;
        case "OAuthAccountNotLinked":
          setError(t("signin.error.accountNotLinked"));
          break;
        case "EmailSignin":
          setError(t("signin.error.emailSignin"));
          break;
        case "CredentialsSignin":
          setError(t("signin.error.credentials"));
          break;
        case "SessionRequired":
          setError(t("signin.error.sessionRequired"));
          break;
        default:
          setError(t("signin.error.default"));
      }
    }
  }, [searchParams, t]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result: any = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("signin.error.credentials"));
      } else {
        router.push("/");
      }
    } catch {
      setError(t("signin.error.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        console.error("Google sign-in error:", result.error);
        setError(t("signin.error.googleGeneric"));
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Google sign-in exception:", error);
      setError(t("signin.error.googleGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md p-8 rounded-3xl glassmorphism text-white shadow-2xl">
      {/* Aurora Effect */}
      <div className="aurora-effect"></div>

      <div className="text-left mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-400">Sign in to your account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleEmailSignIn}>
        <div className="relative mb-6">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-full py-4 pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
            placeholder="Email"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-6">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-full py-4 pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
            placeholder="Password"
          />
        </div>
      </form>

      <div className="flex items-center my-8">
        <hr className="flex-grow border-gray-700" />
        <span className="mx-4 text-gray-500 text-sm">OR</span>
        <hr className="flex-grow border-gray-700" />
      </div>

      <div className="space-y-4">
        <button
          onClick={handleGoogleSignIn}
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
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-orange-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// Loading fallback component
function SignInFormFallback() {
  return (
    <div className="relative w-full max-w-md p-8 rounded-3xl glassmorphism text-white shadow-2xl">
      <div className="aurora-effect"></div>

      <div className="text-left mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-400">Sign in to your account</p>
      </div>

      <div className="space-y-4">
        <div className="h-12 bg-gray-800 rounded-full animate-pulse"></div>
        <div className="h-12 bg-gray-800 rounded-full animate-pulse"></div>
        <div className="h-12 bg-gray-800 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <Suspense fallback={<SignInFormFallback />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
