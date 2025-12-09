"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { updateAttachment, type AttachmentItem } from "@/services/api";
import { useToastStore } from "@/stores";

type EditAttachmentModalProps = {
  attachment: AttachmentItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updatedAttachment: AttachmentItem) => void;
};

export function EditAttachmentModal({
  attachment,
  isOpen,
  onClose,
  onSuccess,
}: EditAttachmentModalProps) {
  const [name, setName] = useState(attachment.name);
  const [folder, setFolder] = useState(() => {
    const pathValue = typeof attachment.path === "string"
      ? attachment.path
      : attachment.path?.name ?? "";
    // Remove leading slash if present
    return pathValue.startsWith("/") ? pathValue.slice(1) : pathValue;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedFolder = folder.trim();

    if (!trimmedName) {
      addToast({
        type: "warning",
        title: "Name required",
        message: "Please provide a file name.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: { name?: string; folder?: string } = {};

      // Only include changed fields
      if (trimmedName !== attachment.name) {
        payload.name = trimmedName;
      }

      const currentFolder = typeof attachment.path === "string"
        ? attachment.path
        : attachment.path?.name ?? "";
      // Remove leading slash for comparison
      const normalizedCurrentFolder = currentFolder.startsWith("/")
        ? currentFolder.slice(1)
        : currentFolder;

      if (trimmedFolder !== normalizedCurrentFolder) {
        payload.folder = trimmedFolder;
      }

      // If nothing changed, just close
      if (Object.keys(payload).length === 0) {
        addToast({
          type: "info",
          title: "No changes",
          message: "No changes were made to the attachment.",
        });
        onClose();
        return;
      }

      const updatedAttachment = await updateAttachment(attachment.id, payload);

      addToast({
        type: "success",
        title: "Attachment updated",
        message: `"${trimmedName}" has been updated successfully.`,
      });

      onSuccess?.(updatedAttachment);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update attachment.";
      addToast({ type: "error", title: "Update failed", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    // Reset form to original values
    setName(attachment.name);
    const pathValue = typeof attachment.path === "string"
      ? attachment.path
      : attachment.path?.name ?? "";
    // Remove leading slash if present
    setFolder(pathValue.startsWith("/") ? pathValue.slice(1) : pathValue);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Attachment"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {isSubmitting && (
              <span
                aria-hidden="true"
                className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Update the file name or move it to a different folder.
        </p>

        <div>
          <label
            htmlFor="attachment-name"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            File Name
          </label>
          <input
            id="attachment-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Document.pdf"
            disabled={isSubmitting}
            className="mt-2 block w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-base text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500 dark:focus:border-white dark:focus:ring-white transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="attachment-folder"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            Folder
          </label>
          <input
            id="attachment-folder"
            type="text"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="e.g. reports"
            disabled={isSubmitting}
            className="mt-2 block w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-base text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500 dark:focus:border-white dark:focus:ring-white transition-all"
          />
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            Leave empty to move to the root folder
          </p>
        </div>
      </div>
    </Modal>
  );
}
