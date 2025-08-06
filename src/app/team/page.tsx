import { Layout } from "@/components/layout";

const teamMembers = [
  {
    name: "John Doe",
    role: "CEO & Founder",
    image: "/images/team/john-doe.jpg",
    bio: "Passionate about creating innovative solutions and leading our team to success.",
  },
  {
    name: "Jane Smith",
    role: "CTO",
    image: "/images/team/jane-smith.jpg",
    bio: "Expert in technology and product development with years of experience.",
  },
  {
    name: "Mike Johnson",
    role: "Head of Design",
    image: "/images/team/mike-johnson.jpg",
    bio: "Creative designer focused on user experience and beautiful interfaces.",
  },
  {
    name: "Sarah Wilson",
    role: "Marketing Director",
    image: "/images/team/sarah-wilson.jpg",
    bio: "Strategic marketer with a passion for growth and brand development.",
  },
];

export default function TeamPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Our Team</h1>

        <div className="bg-custom-dark p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Meet the Team
          </h2>
          <p className="text-gray-400">
            Our diverse team of experts is dedicated to making NexBlog the best
            platform for content creators. We combine creativity, technology,
            and innovation to deliver exceptional experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-custom-dark p-6 rounded-2xl text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {member.name}
              </h3>
              <p className="text-orange-500 mb-4">{member.role}</p>
              <p className="text-gray-400 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
