"use client";

import { useId, useState } from "react";

export type CanvaProps = {
  /**
   * Label displayed on the trigger button.
   */
  triggerLabel?: string;
  /**
   * Title shown at the top of the offcanvas panel.
   */
  title?: string;
  /**
   * Descriptive body text rendered inside the panel.
   */
  description?: string;
  /**
   * Optional class name for the trigger button.
   */
  triggerClassName?: string;
  /**
   * Optional class name for the panel container.
   */
  panelClassName?: string;
};

export function Canva({
  triggerLabel = "Open offcanvas",
  title = "Offcanvas title",
  description = "Some text as placeholder. In real life you can display text, images, lists, or any other elements.",
  triggerClassName = "",
  panelClassName = "",
}: CanvaProps) {
  const [isVisible, setVisible] = useState(false);
  const [isDestroyed, setDestroyed] = useState(false);

  const overlayId = `canva-offcanvas-${useId().replace(/:/g, "")}`;

  if (isDestroyed) {
    return (
      <div className="space-y-3">
        <div>
          <button
            type="button"
            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            disabled
          >
            {triggerLabel}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          <button
            type="button"
            className="py-1 px-2 inline-flex items-center gap-x-1 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
            onClick={() => {
              setDestroyed(false);
            }}
          >
            <svg
              className="shrink-0 size-3.5 text-current"
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
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
              <path d="M16 16h5v5"></path>
            </svg>
            Reinitialize overlay
          </button>
        </div>
      </div>
    );
  }

  const backdrop = (
    <div
      className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      aria-hidden="true"
      onClick={() => setVisible(false)}
    />
  );

  return (
    <div className="space-y-3">
      <div>
        <button
          type="button"
          className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ${triggerClassName}`}
          aria-haspopup="dialog"
          aria-expanded={isVisible}
          aria-controls={overlayId}
          onClick={() => setVisible(true)}
        >
          {triggerLabel}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-1">
        <button
          type="button"
          className="py-1 px-2 inline-flex items-center gap-x-1 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
          onClick={() => {
            setVisible(false);
            setDestroyed(true);
          }}
        >
          <svg
            className="shrink-0 size-3.5 text-current"
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
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          Destroy overlay
        </button>
        <button
          type="button"
          id={`${overlayId}-reinit`}
          className="py-1 px-2 inline-flex items-center gap-x-1 text-sm rounded-lg border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:hover:text-white"
          disabled
        >
          <svg
            className="shrink-0 size-3.5 text-current"
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
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
            <path d="M16 16h5v5"></path>
          </svg>
          Reinitialize overlay
        </button>
      </div>

      {backdrop}

      <div
        id={overlayId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${overlayId}-label`}
        className={`hs-overlay fixed top-0 right-0 z-80 h-full max-w-sm w-full border-l border-gray-200 bg-white shadow-xl transition-transform duration-300 transform dark:border-neutral-700 dark:bg-neutral-800 ${isVisible ? "translate-x-0" : "translate-x-full"} ${panelClassName}`}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-neutral-700">
          <h3 id={`${overlayId}-label`} className="font-bold text-gray-800 dark:text-white">
            {title}
          </h3>
          <button
            type="button"
            aria-label="Close"
            className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus-visible:ring-offset-neutral-900"
            onClick={() => setVisible(false)}
          >
            <span className="sr-only">Close</span>
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-800 dark:text-neutral-300">{description}</p>
        </div>
      </div>
    </div>
  );
}
