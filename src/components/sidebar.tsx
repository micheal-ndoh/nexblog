"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserGroupIcon,
  InformationCircleIcon,
  LightBulbIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "About Us", href: "/about", icon: InformationCircleIcon },
  { name: "Our Team", href: "/team", icon: UserGroupIcon },
  { name: "Insights", href: "/insights", icon: LightBulbIcon },
  { name: "Contact Us", href: "/contact", icon: PhoneIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 z-30">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              className="w-6 h-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            NexBlog
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-gray-800 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? "bg-white/20"
                          : "bg-gray-700/50 hover:bg-gray-600/50"
                      }`}
                    >
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2024 NexBlog</p>
            <p className="mt-1">All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
