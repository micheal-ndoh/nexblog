"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/providers";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} gradient-bg min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
