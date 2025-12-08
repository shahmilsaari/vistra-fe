"use client";

import { useState } from "react";
import { Modal, FileUpload, type FileUploadEntry } from "@/components/ui";
import { uploadAttachment } from "@/services/api";
import { useToastStore } from "@/stores";

type UploadFileModalProps = {
  onUploadSuccess?: () => void;
  folder?: string;
};

export function UploadFileModal({ onUploadSuccess, folder }: UploadFileModalProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileUploadEntry[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleUpload = async () => {
    // Avoid cloning the blobs again—re-using the FilePond files keeps large uploads responsive.
    const selectedFiles = files
      .map((entry) => {
        // Handle FilePondFile object which has a file property
        if (typeof entry === "object" && entry !== null && "file" in entry) {
          return entry.file;
        }
        return null;
      })
      .filter((file): file is File => Boolean(file));

    if (selectedFiles.length === 0) {
      addToast({ type: "warning", title: "Select a file", message: "Pick at least one file before uploading." });
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadAttachment({
        files: selectedFiles,
        folder,
      });

      if (result.length === 0) {
        addToast({ type: "warning", title: "Nothing uploaded", message: "Files could not be processed." });
        return;
      }

      addToast({
        type: "success",
        title: "Upload complete",
        message: `${result.length} file${result.length > 1 ? "s" : ""} added.`,
      });
      setFiles([]);
      onUploadSuccess?.();
      setOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      addToast({ type: "error", title: "Upload failed", message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M4 4v16h16" />
          <path d="M4 8h5l2 2h9" />
        </svg>
        Upload File
      </button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Upload Files"
        footer={
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </>
        }
      >
        <FileUpload files={files} onUpdateFiles={setFiles} label="" />
      </Modal>
    </>
  );
}
