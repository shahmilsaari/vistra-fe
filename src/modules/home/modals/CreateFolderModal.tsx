"use client";

import { useEffect, useState } from "react";
import type { Toast } from "@/stores/toast-store";
import { uploadAttachment } from "@/services/api";
import { Modal, FileUpload, type FileUploadEntry } from "@/components/ui";
import { useToastStore } from "@/stores";

type CreateFolderModalProps = {
  onCreateSuccess?: () => void;
};

type CreateFolderToast = Omit<Toast, "id">;

const toastStyles: Record<CreateFolderToast["type"], string> = {
  success: "border-green-200 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-700 dark:text-green-50",
  error: "border-red-200 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-700 dark:text-red-50",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-500 dark:bg-yellow-700 dark:text-yellow-50",
  info: "border-gray-200 bg-white text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50",
};

export function CreateFolderModal({ onCreateSuccess }: CreateFolderModalProps) {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [files, setFiles] = useState<FileUploadEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const addToast = useToastStore((state) => state.addToast);
  const [inlineToast, setInlineToast] = useState<CreateFolderToast | null>(null);

  const showToast = (toast: CreateFolderToast) => {
    setInlineToast(toast);
    addToast(toast);
  };

  useEffect(() => {
    if (!inlineToast) {
      return;
    }

    const timer = window.setTimeout(() => setInlineToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [inlineToast]);

  const handleClose = () => {
    if (isCreating) {
      return;
    }

    setOpen(false);
    setFolderName("");
    setFiles([]);
  };

  const handleCreate = async () => {
    const trimmedName = folderName.trim();
    if (!trimmedName) {
      showToast({
        type: "warning",
        title: "Folder name required",
        message: "Please provide a folder name before creating.",
      });
      return;
    }

    if (files.length === 0) {
      showToast({
        type: "warning",
        title: "Files required",
        message: "Please upload at least one file to create a folder.",
      });
      return;
    }

    setIsCreating(true);
    try {
      const actualFiles = files
        .map((entry) => {
          if (entry && typeof entry === "object" && "file" in entry) {
            return entry.file as File | null;
          }
          return null;
        })
        .filter((file): file is File => Boolean(file));
      await uploadAttachment({ files: actualFiles, folder: trimmedName });

      showToast({
        type: "success",
        title: "Folder created",
        message: `Folder "${trimmedName}" has been created with ${files.length} file(s).`,
      });
      onCreateSuccess?.();
      setFolderName("");
      setFiles([]);
      setOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create folder.";
      showToast({ type: "error", title: "Create folder failed", message });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        Add New Folder
      </button>
      <Modal
        isOpen={open}
        onClose={handleClose}
        title="Create folder"
        footer={
          <>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating}
              className="flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {isCreating && (
                <span
                  aria-hidden="true"
                  className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
              )}
              {isCreating ? "Creating..." : "Create Folder"}
            </button>
          </>
        }
      >
        {inlineToast && (
          <div
            className={`mb-4 rounded-xl border px-4 py-3 text-sm ${toastStyles[inlineToast.type]}`}
            role="status"
            aria-live="polite"
          >
            {inlineToast.title && <p className="text-sm font-semibold">{inlineToast.title}</p>}
            {inlineToast.message && <p className="mt-1 text-sm opacity-80">{inlineToast.message}</p>}
          </div>
        )}
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Create a new folder and upload initial files to get started.</p>
        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(event) => setFolderName(event.target.value)}
              placeholder="e.g. Invoices"
              disabled={isCreating}
              className="mt-2 block w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-base text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white transition-all"
            />
          </div>

          <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
            <label className="mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Initial Attachments <span className="text-neutral-400 font-normal">(Required)</span>
            </label>
            <FileUpload
              files={files}
              onUpdateFiles={setFiles}
              options={{
                maxFiles: 10,
                acceptedFileTypes: ["image/*", "application/pdf", ".doc", ".docx", ".xls", ".xlsx"],
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
