"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "de" | "es" | "fr" | "ka-GE" | "en-US-POSIX";

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "language-storage",
    }
  )
);

export const languages = {
  en: { name: "English", flag: "🇺🇸" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  es: { name: "Español", flag: "🇪🇸" },
  fr: { name: "Français", flag: "🇫🇷" },
  "ka-GE": { name: "ქართული", flag: "🇬🇪" },
  "en-US-POSIX": { name: "English (US)", flag: "🇺🇸" },
} as const; 