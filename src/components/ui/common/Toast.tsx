"use client";

import { useToastStore } from "@/stores/toast-store";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 p-4 md:absolute md:right-0 md:top-0 md:flex md:flex-col md:items-end md:gap-3">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full max-w-xs rounded-xl shadow-lg transition-all">
          <div
            className={`max-w-xs rounded-xl border text-sm ${
              toast.type === "success"
                ? "border-green-200 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-700 dark:text-green-50"
                : toast.type === "error"
                ? "border-red-200 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-700 dark:text-red-50"
                : toast.type === "warning"
                ? "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-500 dark:bg-yellow-700 dark:text-yellow-50"
                : "border-gray-200 bg-white text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
            }`}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3 p-4">
              <div className="flex-1">
                {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
                {toast.message && <p className="mt-1 text-sm opacity-80">{toast.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="opacity-70 transition hover:opacity-100"
                aria-label="Close toast"
              >
                <svg
                  className="size-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
