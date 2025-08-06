import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexBlog",
  description: "A modern, performant, and secure micro-blog/changelog platform",
};

// Theme initialization script to prevent flash of unstyled content
const themeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('theme-storage');
      if (theme) {
        const parsedTheme = JSON.parse(theme);
        const currentTheme = parsedTheme.state?.theme || 'system';
        
        if (currentTheme === 'dark' || 
            (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      }
    } catch (e) {
      console.warn('Failed to initialize theme:', e);
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} gradient-bg min-h-screen`}>
        <Providers>
          <div className="min-h-screen dark-theme">
            <Sidebar />
            <Header />
            <main className="ml-64 pt-16">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
