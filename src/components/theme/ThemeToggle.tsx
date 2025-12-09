"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Toggle button to switch between light and dark mode.
 * Compact design for sidebar and header usage.
 */
export function ThemeToggle() {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  if (!mounted) {
    return (
      <div className="size-9 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
    );
  }

  const effectiveTheme = resolvedTheme ?? theme ?? "dark";
  const isDark = effectiveTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-9 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 focus:outline-none focus:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 transition-colors"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <svg
          className="shrink-0 size-4 text-amber-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2" />
          <path d="M12 21v2" />
          <path d="M4.22 4.22l1.42 1.42" />
          <path d="M18.36 18.36l1.42 1.42" />
          <path d="M1 12h2" />
          <path d="M21 12h2" />
          <path d="M4.22 19.78l1.42-1.42" />
          <path d="M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg
          className="shrink-0 size-4 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
