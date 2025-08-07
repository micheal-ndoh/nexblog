"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Header } from "./header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen dark-theme">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      </div>
      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onToggle={toggleMobileNav}
        onClose={() => setIsMobileNavOpen(false)}
      />
      {/* Main Content */}
      <Header sidebarCollapsed={sidebarCollapsed} />
      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
