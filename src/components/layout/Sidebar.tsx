"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores";
import { ThemeToggle } from "@/components/theme";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Files",
    href: "/",
    icon: (
      <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v4H4z" />
        <path d="M4 12h16v8H4z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

  return (
    <>
      {/* Sidebar Toggle Button for Mobile */}
      <div className="lg:hidden sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 lg:px-8 dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex items-center py-2">
          <button
            type="button"
            className="size-8 flex justify-center items-center gap-x-2 border border-neutral-200 text-neutral-800 hover:text-neutral-500 rounded-lg focus:outline-none focus:text-neutral-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="hs-application-sidebar"
            aria-label="Toggle navigation"
            data-hs-overlay="#hs-application-sidebar"
          >
            <span className="sr-only">Toggle Navigation</span>
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
              <path d="m14 9 3 3-3 3" />
            </svg>
          </button>

          <ol className="ms-3 flex items-center whitespace-nowrap">
            <li className="flex items-center text-sm text-neutral-800 dark:text-neutral-400">
              <Link href="/" className="font-semibold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Vistra
              </Link>
            </li>
          </ol>
        </div>
      </div>

      {/* Sidebar */}
      <div
        id="hs-application-sidebar"
        className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-[260px] h-full hidden fixed inset-y-0 start-0 z-[60] bg-white border-e border-neutral-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 dark:bg-neutral-800 dark:border-neutral-700"
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Logo */}
          <div className="px-6 pt-4">
            <Link href="/" className="flex items-center gap-x-2 font-semibold text-xl text-neutral-800 dark:text-white" aria-label="Brand">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Vistra</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-100 [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <nav className="hs-accordion-group p-3 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
              <ul className="flex flex-col space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-x-3.5 py-2.5 px-3 text-sm rounded-lg transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                            : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Footer */}
          <div className="mt-auto">
            {/* Theme Toggle */}
            <div className="px-3 pb-2">
              <div className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-lg dark:bg-neutral-700/50">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            {/* User Profile */}
            <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-x-3 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700/50">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-md">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                </div>
                <div className="grow min-w-0">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                    {user?.name ?? "User"}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 truncate">
                    {user?.email ?? "user@example.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
