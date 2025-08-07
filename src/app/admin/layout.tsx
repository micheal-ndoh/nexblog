"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className} gradient-bg min-h-screen`}>
      <Providers>{children}</Providers>
    </div>
  );
}
