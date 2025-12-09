"use client";

import { Modal } from "@/components/ui";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmModal({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete attachment"
      maxWidth="max-w-md"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-neutral-200 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-500/60 dark:bg-white dark:text-red-600 dark:hover:bg-red-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      }
    >
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Are you sure you want to delete this attachment? This action cannot be undone.
      </p>
    </Modal>
  );
}
