"use client";

import { useEffect, useState } from "react";
import { Drawer, Spinner, FileIcon } from "@/components/ui";
import { RemarkModal } from "@/modules/home/modals";
import type { AttachmentItem, RemarkItemDto, PaginatedRemarksDto } from "@/services/api";
import { fetchAttachmentRemarks } from "@/services/api";
import { useToastStore } from "@/stores";
import { formatDateTime } from "@/utils";

const REMARKS_PAGE_LIMIT = 5;

type RemarksDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  attachmentId: number;
  attachment: AttachmentItem | null;
};

export function RemarksDrawer({
  isOpen,
  onClose,
  attachmentId,
  attachment,
}: RemarksDrawerProps) {
  const addToast = useToastStore((state) => state.addToast);
  const [remarks, setRemarks] = useState<RemarkItemDto[]>([]);
  const [remarksMeta, setRemarksMeta] = useState<PaginatedRemarksDto["meta"] | null>(null);
  const [remarksPage, setRemarksPage] = useState(1);
  const [remarksLoading, setRemarksLoading] = useState(false);
  const [remarksError, setRemarksError] = useState<string | null>(null);
  const [remarksRefreshKey, setRemarksRefreshKey] = useState(0);

  useEffect(() => {
    if (!attachmentId || !isOpen) return;

    const controller = new AbortController();
    const startFrame = window.requestAnimationFrame(() => {
      setRemarksLoading(true);
      setRemarksError(null);
    });

    fetchAttachmentRemarks(attachmentId, {
      page: remarksPage,
      limit: REMARKS_PAGE_LIMIT,
      signal: controller.signal,
    })
      .then((payload) => {
        const nextRemarks = Array.isArray(payload.data) ? payload.data : [];
        setRemarks(nextRemarks);
        setRemarksMeta(payload.meta ?? null);
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
        const message = error instanceof Error ? error.message : "Unable to load remarks.";
        setRemarksError(message);
        addToast({ type: "error", title: "Unable to load remarks", message });
      })
      .finally(() => setRemarksLoading(false));

    return () => {
      window.cancelAnimationFrame(startFrame);
      controller.abort();
    };
  }, [addToast, attachmentId, remarksPage, remarksRefreshKey, isOpen]);

  const handleRemarkCreateSuccess = () => {
    setRemarksPage(1);
    setRemarksRefreshKey((prev) => prev + 1);
  };

  const currentRemarksPage = remarksMeta?.page ?? remarksPage;
  const totalRemarksPages = Math.max(remarksMeta?.totalPages ?? 1, 1);
  const canGoToPreviousRemarksPage = currentRemarksPage > 1;
  const canGoToNextRemarksPage = currentRemarksPage < totalRemarksPages;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Remarks"
      maxWidth="max-w-md"
    >
      {/* File pill */}
      <div className="mb-4 rounded-lg bg-neutral-100 px-3 py-2 flex items-center gap-2 dark:bg-neutral-800">
        <div className="flex size-7 shrink-0 items-center justify-center rounded bg-white dark:bg-neutral-700">
          <FileIcon
            kind={attachment?.kind}
            name={attachment?.name ?? ""}
            className="size-4 text-neutral-500 dark:text-neutral-400"
          />
        </div>
        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
          {attachment?.name}
        </p>
      </div>

      {/* Add Remark button */}
      <div className="mb-4">
        <RemarkModal
          attachmentId={attachmentId}
          onCreateSuccess={handleRemarkCreateSuccess}
          renderTrigger={(open) => (
            <button
              type="button"
              onClick={open}
              className="w-full py-2 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-900/20"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Remark
            </button>
          )}
        />
      </div>

      {/* Remarks list */}
      {remarksLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size="sm" />
        </div>
      ) : remarksError ? (
        <p className="text-sm text-red-600 dark:text-red-400">{remarksError}</p>
      ) : !Array.isArray(remarks) || remarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-700 mb-3">
            <svg className="size-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No remarks have been added yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {remarks.map((remark) => (
            <div key={remark.id} className="pb-4 border-b last:border-b-0 border-neutral-100 dark:border-neutral-800">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                  {remark.user.name ? remark.user.name.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {remark.user.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {remark.title}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-400 whitespace-nowrap">
                      {formatDateTime(remark.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {remark.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalRemarksPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-200 pt-3 dark:border-neutral-700">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Page {currentRemarksPage} of {totalRemarksPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRemarksPage((prev) => Math.max(prev - 1, 1))}
              disabled={!canGoToPreviousRemarksPage || remarksLoading}
              className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 disabled:opacity-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setRemarksPage((prev) => Math.min(prev + 1, totalRemarksPages))}
              disabled={!canGoToNextRemarksPage || remarksLoading}
              className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 disabled:opacity-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
