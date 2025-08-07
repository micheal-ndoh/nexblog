'use client';

import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/providers";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} gradient-bg min-h-screen`}>
        <Providers>
          <div className="min-h-screen dark-theme">
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {/* Mobile Navigation */}
            <MobileNav
              isOpen={isMobileNavOpen}
              onToggle={toggleMobileNav}
              onClose={closeMobileNav}
            />

            {/* Header - Pass mobile nav controls */}
            <Header onMobileNavToggle={toggleMobileNav} />

            {/* Main Content - Responsive margins */}
            <main className="lg:ml-64 pt-16 min-h-screen">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}