"use client";

import { Modal } from "@/components/ui";
import { useState } from "react";

export function CreateFolderModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-fuchsia-200 bg-fuchsia-500/10 px-3 py-2 text-sm font-medium text-fuchsia-900 transition hover:bg-fuchsia-500/20 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-fuchsia-500 dark:border-fuchsia-500/40 dark:bg-fuchsia-500/20 dark:text-fuchsia-50"
      >
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        Add New Folder
      </button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Create folder"
        footer={
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-fuchsia-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-fuchsia-500 focus:outline-hidden focus:bg-fuchsia-500"
            >
              Create
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-neutral-300">Enter a name for the new folder.</p>
      </Modal>
    </>
  );
}
