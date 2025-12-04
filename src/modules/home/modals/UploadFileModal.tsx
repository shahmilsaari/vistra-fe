"use client";

import { useState } from "react";
import type { FilePondInitialFile } from "filepond";
import { Button, Modal, FileUpload } from "@/components/ui";

export function UploadFileModal() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FilePondInitialFile[]>([]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-500/20 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-50"
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
            <Button variant="outline" hideDefaultIcon onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" hideDefaultIcon>
              Upload
            </Button>
          </>
        }
      >
        <FileUpload files={files} onUpdateFiles={setFiles} label="" />
      </Modal>
    </>
  );
}
