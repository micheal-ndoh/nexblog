"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
    }
  )
);

export function getThemeClass(theme: Theme): string {
  if (theme === "system") {
    return "";
  }
  return theme === "dark" ? "dark" : "";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const html = document.documentElement;

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.setAttribute("data-theme", systemTheme);
    if (systemTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  } else {
    root.setAttribute("data-theme", theme);
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }
} 