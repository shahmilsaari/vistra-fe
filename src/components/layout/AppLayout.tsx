"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/stores";
import { useToastStore } from "@/stores";
import { logout } from "@/services/api";
import { ThemeToggle } from "@/components/theme";
import { useAuth } from "@/hooks/useAuth";

type AppLayoutProps = {
  children: React.ReactNode;
  breadcrumb?: React.ReactNode;
};

export function AppLayout({ children, breadcrumb }: AppLayoutProps) {
  const router = useRouter();
  const { user } = useAuth();
  const clearUser = useUserStore((state) => state.clearUser);
  const addToast = useToastStore((state) => state.addToast);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    try {
      await logout();
      addToast({ type: "success", title: "Logged out", message: "You have been signed out." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reach the server.";
      addToast({ type: "error", title: "Logout failed", message });
    } finally {
      clearUser();
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-900">
      {/* Icon-only Sidebar */}
      <aside className="hidden lg:flex flex-col items-center w-16 py-4 border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        {/* Logo */}
        <Link href="/" className="mb-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </Link>

        {/* Navigation Icons */}
        <nav className="flex flex-col items-center gap-2 flex-1">
          <Link
            href="/"
            className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            title="Home"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Search"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Favorites"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Documents"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Team"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Activity"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Trash"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Breadcrumb and User */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumb || (
              <Link href="/" className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                All folders
              </Link>
            )}
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-semibold">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{user?.name ?? "User"}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.role ?? "User"}</p>
                </div>
                <svg className={`size-4 text-neutral-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-neutral-200 shadow-lg dark:bg-neutral-800 dark:border-neutral-700 z-50">
                    <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email}</p>
                    </div>
                    <div className="p-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
