import { Layout } from "@/components/layout";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-4 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8">
        Contact Us
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="glassmorphism-card p-4 sm:p-6 lg:p-8 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-400 mb-6 sm:mb-8">
            Have questions or need assistance? We'd love to hear from you. Send
            us a message and we'll respond as soon as possible.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-gray-400">hello@nexblog.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Phone</p>
                <p className="text-gray-400">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Address</p>
                <p className="text-gray-400">
                  123 Blog Street, Content City, CC 12345
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glassmorphism-card p-4 sm:p-6 lg:p-8 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
            Send Message
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your message..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full btn-primary px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-base sm:text-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
