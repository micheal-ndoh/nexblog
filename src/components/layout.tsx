import { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen dark-theme">
      <Sidebar />
      <Header />
      <main className="ml-64">
        {children}
      </main>
    </div>
  );
} 