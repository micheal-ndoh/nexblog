import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin | NexBlog",
  description: "Admin dashboard for NexBlog",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} gradient-bg min-h-screen`}>
        <Providers>
          <div className="min-h-screen dark-theme">
            <Sidebar />
            <main className="ml-64 pt-16">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
