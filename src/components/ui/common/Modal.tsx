"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
};

export function Modal({ isOpen, onClose, title, children, footer, maxWidth = "max-w-3xl" }: ModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 m-4 w-full ${maxWidth} rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900`}>
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-neutral-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-800 transition hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
            aria-label="Close"
          >
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto px-4 py-5 text-gray-700 dark:text-neutral-200">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-4 py-3 dark:border-neutral-700">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
