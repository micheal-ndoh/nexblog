"use client";

import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { useState } from "react";
import RootLayoutServer from "./layout.server"; // Import the server component

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  return (
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
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootLayoutServer>
      <RootLayoutContent>{children}</RootLayoutContent>
    </RootLayoutServer>
  );
}
