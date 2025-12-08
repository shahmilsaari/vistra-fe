"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore, useToastStore } from "@/stores";
import { logout } from "@/services/api";

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export function Header({ title = "Dashboard", subtitle }: HeaderProps) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const addToast = useToastStore((state) => state.addToast);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
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
    <header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-[48] w-full bg-white border-b border-neutral-200 text-sm py-2.5 lg:ps-[260px] dark:bg-neutral-800 dark:border-neutral-700">
      <nav className="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
        <div className="me-5 lg:me-0 lg:hidden">
          {/* Mobile sidebar toggle placeholder - the actual button is in Sidebar component */}
        </div>

        <div className="w-full flex items-center justify-between ms-auto">
          <div className="hidden lg:block">
            <div>
              <h1 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-neutral-500 dark:text-neutral-500">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-row items-center justify-end gap-3">
            {/* Notifications (placeholder) */}
            <button
              type="button"
              className="size-[38px] relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-neutral-800 hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="sr-only">Notifications</span>
            </button>

            {/* User Dropdown */}
            <div className="relative inline-flex">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 focus:outline-none focus:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              >
                <div className="flex items-center gap-x-2 py-1 ps-1 pe-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xs font-semibold">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="hidden sm:block truncate max-w-[100px] text-neutral-800 dark:text-neutral-200">
                    {user?.name ?? "User"}
                  </span>
                  <svg className={`size-4 text-neutral-600 dark:text-neutral-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 min-w-60 bg-white shadow-lg rounded-lg border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 z-50">
                    <div className="p-1">
                      {/* User Info */}
                      <div className="py-3 px-4 bg-neutral-50 rounded-lg dark:bg-neutral-700/50 mb-1">
                        <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">
                          {user?.name ?? "User"}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 truncate">
                          {user?.email ?? "user@example.com"}
                        </p>
                        {user?.role && (
                          <span className="mt-2 inline-flex items-center gap-x-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-800/30 dark:text-violet-500">
                            {user.role}
                          </span>
                        )}
                      </div>

                      {/* Menu Items */}
                      <button
                        type="button"
                        className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-neutral-800 hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                      >
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Profile
                      </button>

                      <button
                        type="button"
                        className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-neutral-800 hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                      >
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Settings
                      </button>

                      <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-50 dark:text-red-500 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10"
                      >
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
