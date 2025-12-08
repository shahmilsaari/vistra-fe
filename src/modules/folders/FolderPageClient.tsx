"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Spinner, FileIcon, Modal } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { deleteAttachment, fetchAttachments } from "@/services/api";
import { useToastStore, useUserStore } from "@/stores";
import { type DocumentItem } from "@/modules/home/data";
import { UploadFileModal } from "@/modules/home/modals";
import { useAuth } from "@/hooks/useAuth";
import { mapAttachmentToDocument } from "@/modules/home/mappers";
import type { UserProfile } from "@/stores/user-store";

type FolderPageClientProps = {
  folderName: string;
  initialData?: DocumentItem[];
  initialUser?: UserProfile | null;
  defaultPageSize?: number;
};

export function FolderPageClient({
  folderName,
  initialData = [],
  initialUser,
  defaultPageSize = 100,
}: FolderPageClientProps) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const setUser = useUserStore((state) => state.setUser);
  const addToast = useToastStore((state) => state.addToast);
  const [items, setItems] = useState<DocumentItem[]>(initialData);
  const [isFetching, setIsFetching] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<DocumentItem | null>(null);
  const hasSeededUser = useRef(false);
  const hasLoadedOnce = useRef(initialData.length > 0);

  useEffect(() => {
    if (!hasSeededUser.current && initialUser && !user) {
      setUser(initialUser);
      hasSeededUser.current = true;
    }
  }, [initialUser, setUser, user]);

  const handleDeleteClick = (e: React.MouseEvent, item: DocumentItem) => {
    e.stopPropagation();
    setItemToDelete(item);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeletingId(itemToDelete.id);
    try {
      await deleteAttachment(itemToDelete.id);
      addToast({ type: "success", title: "Deleted", message: "File deleted successfully." });
      await loadAttachments();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete file.";
      addToast({ type: "error", title: "Delete failed", message });
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
    }
  };

  const loadAttachments = useCallback(
    async (signal?: AbortSignal) => {
      setIsFetching(true);
      try {
        const payload = await fetchAttachments({
          signal,
          limit: defaultPageSize,
          sortBy: "createdAt",
          sortOrder: "desc",
          folder: folderName,
        });

        const fileRows = payload.data.map(mapAttachmentToDocument);
        setItems(fileRows);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        const message = error instanceof Error ? error.message : "Unable to load attachments.";
        addToast({ type: "error", title: "Unable to load data", message });
      } finally {
        setIsFetching(false);
      }
    },
    [addToast, defaultPageSize, folderName]
  );

  useEffect(() => {
    if (hasLoadedOnce.current) {
      return;
    }
    if (!isAuthLoading && user) {
      hasLoadedOnce.current = true;
      const controller = new AbortController();
      loadAttachments(controller.signal);
      return () => controller.abort();
    }
  }, [isAuthLoading, user, loadAttachments]);

  if (isAuthLoading) {
    return null;
  }

  return (
    <ProtectedRoute title="Folder" subtitle={folderName}>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        title="Delete item"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setItemToDelete(null)}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-neutral-200 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 disabled:opacity-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deletingId !== null}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        }
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Are you sure you want to delete <span className="font-medium">{itemToDelete?.name}</span>? This action cannot be undone.
        </p>
      </Modal>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-neutral-200 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 disabled:opacity-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
          >
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back
          </button>
        </div>

        {/* Folder Header Card */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                  <svg className="size-7 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-white">{folderName}</h2>
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <UploadFileModal onUploadSuccess={loadAttachments} folder={folderName} />
              </div>
            </div>
          </div>
        </div>

        {/* Contents Section */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">Contents</h3>

          {isFetching ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-800/50">
              <div className="rounded-full bg-neutral-100 p-4 dark:bg-neutral-700">
                <svg className="size-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-800 dark:text-white">This folder is empty</p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Upload files to get started</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.kind === "folder") {
                      router.push(`/folders/${item.name}`);
                    } else {
                      router.push(`/attachments/${item.id}`);
                    }
                  }}
                  className="group relative bg-white border border-neutral-200 rounded-xl p-4 shadow-sm transition-all hover:shadow-md hover:border-neutral-300 cursor-pointer dark:bg-neutral-800 dark:border-neutral-700 dark:hover:border-neutral-600"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-neutral-50 dark:bg-neutral-700">
                      <FileIcon kind={item.kind} name={item.name} className="size-6 text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <p className="truncate text-sm font-medium text-neutral-800 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 transition-colors">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {item.date}
                      </p>
                      {item.size && (
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                          {item.size}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(e, item)}
                    disabled={deletingId === item.id}
                    className="absolute top-3 right-3 size-8 inline-flex justify-center items-center rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                    aria-label="Delete"
                  >
                    {deletingId === item.id ? (
                      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
