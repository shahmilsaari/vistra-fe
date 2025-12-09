"use client";

import { FileIcon } from "@/components/ui";
import type { AttachmentItem } from "@/services/api";
import { formatDate } from "@/utils";

type AttachmentHeaderProps = {
  attachment: AttachmentItem;
  remarksCount: number;
  onDownload: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenRemarks: () => void;
};

export function AttachmentHeader({
  attachment,
  remarksCount,
  onDownload,
  onEdit,
  onDelete,
  onOpenRemarks,
}: AttachmentHeaderProps) {
  const remarkButtonLabel = `${remarksCount} ${remarksCount === 1 ? "remark" : "remarks"}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6">
      {/* File Info */}
      <div className="flex items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <FileIcon
            kind={attachment.kind}
            mime={attachment.mime}
            name={attachment.name}
            className="size-8 text-neutral-500 dark:text-neutral-400"
          />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">{attachment.name}</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Created on {formatDate(attachment.createdAt)} by {attachment.createdBy?.name ?? "Unknown"}
          </p>
          {/* Action Links */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Download
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 font-medium"
            >
              Edit
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              Delete
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Info Card - Yellow/Lime dashed box */}
      <div className="rounded-xl border-2 border-dashed border-lime-300 bg-lime-50 p-5 dark:border-lime-600 dark:bg-lime-900/20">
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          Last updated on <span className="font-medium">{formatDate(attachment.updatedAt)}</span>
        </p>
        <div className="my-4 border-t border-dashed border-lime-300 dark:border-lime-600" />
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Shared with</p>
            <button className="mt-1 inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              <span className="underline decoration-dotted underline-offset-2">4 members</span>
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Additional remark</p>
            <button
              onClick={onOpenRemarks}
              className="mt-1 inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span className="underline decoration-dotted underline-offset-2">{remarkButtonLabel}</span>
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
