"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <div className="min-h-screen dark-theme">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onToggle={toggleMobileNav}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content */}
      <main className=" min-h-screen">{children}</main>
    </div>
  );
}
