import { Layout } from "@/components/layout";

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 text-left">
        <h1 className="text-4xl font-bold text-white mb-8 text-left">
          About Us
        </h1>

        <div className="bg-custom-dark p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Our Story</h2>
          <p className="text-gray-400 mb-6">
            NexBlog is a modern blogging platform designed to empower creators
            and businesses to share their insights, stories, and expertise with
            the world. We believe in the power of content to connect, inspire,
            and drive meaningful conversations.
          </p>
          <p className="text-gray-400">
            Founded with a vision to make content creation accessible and
            engaging, NexBlog provides the tools and platform you need to build
            your digital presence and reach your audience effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-custom-dark p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              Our Mission
            </h3>
            <p className="text-gray-400">
              To provide a seamless, user-friendly platform that enables
              creators to share their knowledge and connect with their audience
              through compelling content.
            </p>
          </div>

          <div className="bg-custom-dark p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              Our Vision
            </h3>
            <p className="text-gray-400">
              To become the leading platform for content creators, offering
              innovative tools and features that enhance the blogging
              experience.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
