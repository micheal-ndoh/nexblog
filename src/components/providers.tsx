"use client";

import { SessionProvider } from "next-auth/react";
import { TolgeeWrapper } from "@/lib/tolgee";
import { ThemeProvider } from "@/components/theme-provider";
import { ToasterProvider } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TolgeeWrapper>
        <ThemeProvider>
          <ToasterProvider>{children}</ToasterProvider>
        </ThemeProvider>
      </TolgeeWrapper>
    </SessionProvider>
  );
}
