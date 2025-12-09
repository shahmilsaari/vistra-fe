"use client";

import { useRouterLoading } from "@/hooks/useRouterLoading";

export function TestLoadingClient() {
  const router = useRouterLoading();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Test Loading Bar
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Click the buttons below to test the global loading indicator
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/")}
            className="p-6 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <div className="text-xl font-semibold mb-2">Go to Home</div>
            <div className="text-sm opacity-90">Navigate to home page</div>
          </button>

          <button
            onClick={() => router.push("/folders/finance")}
            className="p-6 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <div className="text-xl font-semibold mb-2">Go to Finance Folder</div>
            <div className="text-sm opacity-90">Navigate to finance folder</div>
          </button>

          <button
            onClick={() => router.back()}
            className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <div className="text-xl font-semibold mb-2">Go Back</div>
            <div className="text-sm opacity-90">Navigate to previous page</div>
          </button>

          <button
            onClick={() => {
              // Simulate a slow navigation by adding artificial delay
              setTimeout(() => router.push("/"), 1500);
            }}
            className="p-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <div className="text-xl font-semibold mb-2">Slow Navigation</div>
            <div className="text-sm opacity-90">Navigate with 1.5s delay</div>
          </button>
        </div>

        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            How to see the loading bar:
          </h2>
          <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Click any button above to trigger navigation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-500">•</span>
              <span>Watch the top of the page for the animated loading bar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              <span>The loading bar will appear immediately and disappear when the page loads</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
            <span>Try &quot;Slow Navigation&quot; to see the loading bar for a longer duration</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-xl p-6 border-2 border-dashed border-blue-200 dark:border-blue-700">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            Loading Bar Preview
          </h3>
          <div className="relative h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div className="absolute inset-0 origin-left animate-loading-bar bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500" />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            This is what the loading bar looks like
          </p>
        </div>
      </div>
    </div>
  );
}
