"use client";

import { useState, Suspense } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useSearchParams } from "next/navigation";

// Component that uses useSearchParams - needs to be wrapped in Suspense
function AuthTestContent() {
  const [providers, setProviders] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const testProviders = async () => {
    setLoading(true);
    setError("");
    try {
      const providers = await getProviders();
      setProviders(providers);
      console.log("Available providers:", providers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get providers");
      console.error("Provider error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        setError(`Sign-in error: ${result.error}`);
        console.error("Sign-in error:", result);
      } else if (result?.ok) {
        setError("Sign-in successful!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      console.error("Sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  const oauthError = searchParams.get("error");

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">OAuth Test Page</h1>

        {oauthError && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <h2 className="text-red-400 font-semibold mb-2">OAuth Error:</h2>
            <p className="text-red-300 text-sm">{oauthError}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <h2 className="text-red-400 font-semibold mb-2">Test Error:</h2>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={testProviders}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Available Providers"}
          </button>

          <button
            onClick={testGoogleSignIn}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Test Google Sign In"}
          </button>
        </div>

        {providers && (
          <div className="mt-6">
            <h2 className="text-white font-semibold mb-2">
              Available Providers:
            </h2>
            <pre className="bg-gray-700 p-3 rounded text-xs text-gray-300 overflow-auto">
              {JSON.stringify(providers, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-400">
          <h3 className="font-semibold mb-2">Environment Check:</h3>
          <ul className="space-y-1">
            <li>
              NEXTAUTH_URL: {process.env.NEXT_PUBLIC_NEXTAUTH_URL || "Not set"}
            </li>
            <li>
              GOOGLE_CLIENT_ID:{" "}
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? "Set" : "Not set"}
            </li>
            <li>
              GOOGLE_CLIENT_SECRET:{" "}
              {process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function AuthTestFallback() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AuthTestPage() {
  return (
    <Suspense fallback={<AuthTestFallback />}>
      <AuthTestContent />
    </Suspense>
  );
}
