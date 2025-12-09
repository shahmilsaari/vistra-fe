"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import type { ReactNode } from "react";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Tailwind max-width for the drawer panel, e.g. "max-w-md". */
  maxWidth?: string;
};

export function Drawer({ isOpen, onClose, title, children, maxWidth = "max-w-md" }: DrawerProps) {
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative ml-auto flex h-full w-full ${maxWidth} transform bg-white shadow-2xl border-s border-neutral-200 transition-transform duration-300 dark:bg-neutral-800 dark:border-neutral-700`}
      >
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            {title && (
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {title}
              </h3>
            )}
            <button
              type="button"
              onClick={onClose}
              className="size-8 inline-flex justify-center items-center rounded-full border border-transparent bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:outline-none focus:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-300"
              aria-label="Close"
            >
              <svg
                className="size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

