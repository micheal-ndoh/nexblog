import { Suspense } from "react";
import { PostFeed } from "@/components/post-feed";
import { PostFeedSkeleton } from "@/components/post-feed-skeleton";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="text-center mb-16 pt-8 px-4">
        <div className="inline-block glassmorphism-dark rounded-full px-4 py-1 text-sm mb-4">
          <span className="text-orange-400 mr-2">●</span> Latest
        </div>
        <h2 className="text-5xl font-bold mb-6 text-white">
          Discover our Insights
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
          Stay up-to-date with our latest blog posts and insights.
        </p>

        {/* Featured Post Section */}
        <div className="glassmorphism-card p-8 rounded-2xl max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden">
                <div className="w-full h-64 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-xl mb-4 mx-auto flex items-center justify-center">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Empower Your Team</h3>
                    <p className="text-sm opacity-80">Seamless Collaboration</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-left">
              <p className="text-orange-400 text-sm mb-2 font-medium">
                Featured Post
              </p>
              <h3 className="text-3xl font-semibold mb-4 text-white">
                10 Tips for Successful Blogging
              </h3>
              <p className="text-gray-300 mb-6 text-lg">
                Learn how to create engaging blog content that converts and
                drives profits.
              </p>
              <Link
                href="/posts/new"
                className="btn-primary px-6 py-3 rounded-xl font-semibold inline-flex items-center transition-all duration-200 hover:scale-105"
              >
                Read More
                <svg
                  className="w-5 h-5 ml-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                </svg>
              </Link>
              <div className="flex items-center text-gray-300 mt-6">
                <div className="w-6 h-6 rounded-full bg-orange-500 mr-2"></div>
                <span className="text-sm font-medium">John Doe</span>
                <span className="mx-4">•</span>
                <span className="text-sm">5 min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="mb-16 max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white">All Blog Posts</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 font-medium">Sort by:</span>
            <button className="glassmorphism-dark px-4 py-2 rounded-xl flex items-center text-white hover:bg-gray-800/50 transition-all duration-200">
              Categories
              <svg
                className="w-5 h-5 ml-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Blog Post Cards */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="glassmorphism-card p-6 rounded-2xl hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
            >
              <div className="w-full h-48 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl mb-2 mx-auto flex items-center justify-center">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium">Tech</p>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-300 mb-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 mr-2"></div>
                <span className="font-medium">John Doe</span>
              </div>

              <h3 className="text-xl font-semibold mb-2 text-white">
                The Importance of Blogging for Business
              </h3>

              <p className="text-gray-300 text-sm mb-4">
                Discover how blogging can boost your business growth and drive
                engagement.
              </p>

              <div className="flex space-x-2 text-xs">
                <span className="tag-blue px-2 py-1 rounded-full text-white font-medium">
                  Business
                </span>
                <span className="tag-green px-2 py-1 rounded-full text-white font-medium">
                  Marketing
                </span>
                <span className="tag-purple px-2 py-1 rounded-full text-white font-medium">
                  Growth
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="glassmorphism-card rounded-2xl p-12 text-center my-16 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-white">
          Stay Updated With Our Newsletter
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg">
          Subscribe to our newsletter to receive updates, exclusive insights,
          and valuable resources directly to your inbox.
        </p>
        <div className="flex justify-center max-w-md mx-auto">
          <input
            className="glassmorphism-dark border border-gray-700/50 rounded-l-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
            placeholder="Enter your email"
            type="email"
          />
          <button className="btn-primary px-6 py-3 rounded-r-xl font-semibold transition-all duration-200 hover:scale-105">
            Subscribe
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          By clicking subscribe you agree to our Terms and Conditions.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="mb-16 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Access answers to common questions about our services, products,
              and more in this section.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-gray-300 hover:text-white cursor-pointer transition-colors">
                <span className="mr-2 text-orange-400">•</span>
                <span className="font-medium">SEO & Marketing?</span>
              </div>
              <div className="flex items-center text-gray-300 hover:text-white cursor-pointer transition-colors">
                <span className="mr-2 text-orange-400">•</span>
                <span className="font-medium">How to build a website?</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glassmorphism-card p-6 rounded-xl">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="font-semibold text-white">What is no-code?</h3>
                <svg
                  className="w-5 h-5 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </div>
              <p className="text-gray-300 mt-4">
                No-code is a software development method that allows people to
                build apps and websites without writing code, using visual
                drag-and-drop interfaces.
              </p>
            </div>

            <div className="glassmorphism-card p-6 rounded-xl">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="font-semibold text-white">
                  What are the benefits?
                </h3>
                <svg
                  className="w-5 h-5 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </div>
            </div>

            <div className="glassmorphism-card p-6 rounded-xl">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="font-semibold text-white">
                  What services do you offer?
                </h3>
                <svg
                  className="w-5 h-5 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </div>
            </div>

            <div className="glassmorphism-card p-6 rounded-xl">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="font-semibold text-white">
                  How can I get started?
                </h3>
                <svg
                  className="w-5 h-5 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Post Feed */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white">Latest Posts</h2>
        </div>

        <Suspense fallback={<PostFeedSkeleton />}>
          <PostFeed />
        </Suspense>
      </section>
    </div>
  );
}
