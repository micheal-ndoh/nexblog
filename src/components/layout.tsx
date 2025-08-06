import { ReactNode } from "react";
import { Sidebar } from "./sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen dark-theme">
      <Sidebar />
      <main className="">{children}</main>
    </div>
  );
}
