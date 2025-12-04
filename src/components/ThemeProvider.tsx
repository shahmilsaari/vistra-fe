"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

type Props = {
  children: ReactNode;
};

declare global {
  interface Window {
    HSOverlay?: {
      autoInit?: () => void;
    };
  }
}

export function ThemeProvider({ children }: Props) {
  useEffect(() => {
    import("preline/preline").then(() => {
      if (typeof window !== "undefined") {
        window.HSOverlay?.autoInit?.();
      }
    });
  }, []);

  return (
    <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemeProvider>
  );
}
