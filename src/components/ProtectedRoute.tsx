"use client";

import { useAuth } from "@/hooks/useAuth";
import { AppLayout, Breadcrumb } from "@/components/layout";

type ProtectedRouteProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
};

export function ProtectedRoute({ children, title, subtitle, breadcrumbItems }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading state with modern skeleton matching AppLayout
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-white dark:bg-neutral-900">
        {/* Skeleton Icon Sidebar */}
        <aside className="hidden lg:flex flex-col items-center w-16 py-4 border-r border-neutral-200 dark:border-neutral-700">
          <div className="mb-6 size-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          <div className="flex flex-col items-center gap-2 flex-1">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="size-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            ))}
          </div>
          <div className="mt-auto size-9 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        </aside>

        {/* Skeleton Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Skeleton Header */}
          <header className="h-16 px-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="h-4 w-48 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="size-5 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              <div className="h-9 w-32 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            </div>
          </header>

          {/* Skeleton Content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="space-y-6">
              {/* Page title skeleton */}
              {title && (
                <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="space-y-2">
                    <div className="h-7 w-40 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                    {subtitle && <div className="h-4 w-64 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />}
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-28 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                    <div className="h-10 w-28 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Content skeleton */}
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="h-10 w-10 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                      <div className="h-3 w-1/4 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-16 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                      <div className="h-8 w-16 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Build breadcrumb
  const breadcrumb = breadcrumbItems ? (
    <Breadcrumb items={breadcrumbItems} />
  ) : title ? (
    <Breadcrumb items={[{ label: "All folders", href: "/" }, { label: title }]} />
  ) : undefined;

  return (
    <AppLayout breadcrumb={breadcrumb}>
      {(title || subtitle) && (
        <div className="px-6 lg:px-8 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-700">
          {title && <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">{title}</h1>}
          {subtitle && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
        </div>
      )}
      <div className="p-6 lg:p-8">{children}</div>
    </AppLayout>
  );
}
