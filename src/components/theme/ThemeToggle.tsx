"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Simple button to switch between light and dark mode.
 */
export function ThemeToggle() {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Suppress hydration mismatch by rendering only after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const effectiveTheme = resolvedTheme ?? theme ?? "dark";
  const isDark = effectiveTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
      aria-label={`Activate ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <>
          <svg
            className="size-4 text-amber-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v1" />
            <path d="M12 20v1" />
            <path d="M4.22 4.22l.7.7" />
            <path d="M18.36 18.36l.7.7" />
            <path d="M1 12h1" />
            <path d="M22 12h1" />
            <path d="M4.22 19.78l.7-.7" />
            <path d="M18.36 5.64l.7-.7" />
            <circle cx="12" cy="12" r="5" />
          </svg>
          Light mode
        </>
      ) : (
        <>
          <svg
            className="size-4 text-blue-600 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
          </svg>
          Dark mode
        </>
      )}
    </button>
  );
}
