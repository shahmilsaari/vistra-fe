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
  /**
   * If true, modal cannot be closed by clicking backdrop or pressing Escape
   */
  disableBackdropClose?: boolean;
};

/**
 * Preline-inspired Modal component
 * Based on Preline's overlay patterns with backdrop blur and smooth animations
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-lg",
  disableBackdropClose = false
}: ModalProps) {
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape" && !disableBackdropClose) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, disableBackdropClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const handleBackdropClick = () => {
    if (!disableBackdropClose) {
      onClose();
    }
  };

  return createPortal(
    <>
      {/* Backdrop with Preline-style blur */}
      <div
        className="fixed inset-0 z-[60] bg-gray-900/50 dark:bg-neutral-900/90 transition duration-300 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto overflow-x-hidden p-4">
        <div
          className={`relative flex flex-col w-full ${maxWidth} bg-white border border-gray-200 rounded-xl shadow-sm pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
            <h3 className="font-bold text-gray-800 dark:text-white">
              {title}
            </h3>
            {!disableBackdropClose && (
              <button
                type="button"
                onClick={onClose}
                className="size-7 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                aria-label="Close"
              >
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="text-gray-800 dark:text-neutral-400">
              {children}
            </div>
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
